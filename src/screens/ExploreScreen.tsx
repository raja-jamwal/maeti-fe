import * as React from 'react';
import {
	Image,
	StyleSheet,
	TextInput,
	View,
	TouchableNativeFeedback,
	FlatList,
	StatusBar,
	TouchableOpacity,
	SafeAreaView
} from 'react-native';
import Colors from '../constants/Colors';
import GlobalStyles from '../styles/global';
import ConnectedProfile from '../components/profile-card/connected-profile';
import { Ionicons } from '@expo/vector-icons';
import TabbedFilters from '../components/tabbed-filters/index';
import { connect } from 'react-redux';
import { Throbber } from '../components/throbber/throbber';
import { NavigationInjectedProps } from 'react-navigation';
import { IUserProfileState } from '../store/reducers/user-profile-reducer';
import { IRootState } from '../store';
import { bindActionCreators, Dispatch } from 'redux';
import {
	clearSearchResultForScreen,
	EXPLORE_SCREENS,
	isPaidScreen,
	mayBeFetchSearchResult,
	setSearchResultForScreen
} from '../store/reducers/explore-reducer';
import { toArray, sortBy, head, isEmpty, includes } from 'lodash';
import { applyGlobalFilter, getSearchFilter } from '../store/reducers/filter-reducer';
import { getLogger } from '../utils/logger';
import {
	getCurrentUserProfile,
	getCurrentUserProfileId
} from '../store/reducers/self-profile-reducer';
import SelectedFilter from '../components/selected-filters';
import EmptyResult from '../components/empty-result';
import ConnectedPurchaseButton from '../components/purchase-button/purchase-button';
import { isAccountPaid } from '../store/reducers/account-reducer';
import TouchableBtn from '../components/touchable-btn/touchable-btn';

const defaultPrimaryPhoto = require('../assets/images/placeholder.png');

interface IExploreScreenProps {
	userProfiles: IUserProfileState;
	fetching: boolean;
	selectedScreen: string;
	mayBeFetchSearchResult: (screen: string) => any;
	clearSearchResultForScreen: (screen: string) => any;
	selectedFilter: any;
	isAccountPaid: boolean;
	isPaidScreen: boolean;
}

const ExploreScreenHeader = (props: any) => {
	const navigateToProfile = () =>
		props.navigation.push('ProfileScreen', { userProfileId: props.currentUserProfileId });
	const openFilterScreen = () => props.navigation.push('FilterScreen');
	const profileImage = head(props.currentUserProfile.photo);
	const profileAvatar = !isEmpty(profileImage)
		? {
				uri: profileImage.url,
				width: 36,
				height: 36
		  }
		: defaultPrimaryPhoto;
	const onSubmitEditing = ({ nativeEvent: { text } }) => props.applyGlobalFilter(text);
	return (
		<SafeAreaView style={{ backgroundColor: Colors.white }}>
			<View style={[GlobalStyles.row, GlobalStyles.alignCenter, styles.header]}>
				<TouchableBtn onPress={() => navigateToProfile()}>
					<Image source={profileAvatar} style={styles.avatar} />
				</TouchableBtn>
				<TextInput
					style={[GlobalStyles.expand, styles.searchInput]}
					onSubmitEditing={onSubmitEditing}
				/>
				{/*<TouchableNativeFeedback>
				<Icon.Ionicons
					style={styles.navBarIcon}
					color={Colors.white}
					name="md-save"
					size={26}
				/>
			</TouchableNativeFeedback>*/}
				<TouchableBtn onPress={() => openFilterScreen()}>
					<Ionicons
						style={styles.navBarIcon}
						color={Colors.offWhite}
						name="md-funnel"
						size={26}
					/>
				</TouchableBtn>
			</View>
		</SafeAreaView>
	);
};

const ConnectedHeader = connect(
	(state: IRootState) => {
		return {
			currentUserProfileId: getCurrentUserProfileId(state),
			currentUserProfile: getCurrentUserProfile(state),
			filters: getSearchFilter(state)
		};
	},
	dispatch => {
		return {
			applyGlobalFilter: bindActionCreators(applyGlobalFilter, dispatch)
		};
	}
)(ExploreScreenHeader);

class ExploreScreen extends React.PureComponent<NavigationInjectedProps & IExploreScreenProps> {
	private logger = getLogger(ExploreScreen);

	static navigationOptions = ({ navigation }) => ({
		title: 'Explore',
		header: () => <ConnectedHeader navigation={navigation} />
	});

	constructor(props: any) {
		super(props);
		this.openProfileScreen = this.openProfileScreen.bind(this);
		this._handleMore = this._handleMore.bind(this);
	}

	openProfileScreen(userProfileId: number, profileName: string) {
		const { navigation } = this.props;
		navigation.push('ProfileScreen', { userProfileId, profileName });
	}

	getItems() {
		const { userProfiles, fetching, selectedScreen, isPaidScreen, isAccountPaid } = this.props;
		const items: any = [
			{
				type: 'filter-tab',
				key: 'filter-tab'
			},
			{
				type: 'selected-filters',
				key: 'selected-filters'
			}
		];

		if (isPaidScreen && !isAccountPaid) {
			items.push({
				type: 'purchase-button',
				key: 'purchase-button'
			});
			return items;
		}

		if (toArray(userProfiles).length) {
			sortBy(toArray(userProfiles), 'updatedOn')
				.reverse()
				.forEach(userProfile => {
					const userProfileId = userProfile.id;
					items.push({
						type: 'user-profile',
						key: `profile-${userProfileId}`,
						profileId: userProfileId,
						profileName: userProfile.fullName
					});
				});
		} else {
			if (!fetching) {
				items.push({
					type: 'empty-result',
					key: 'empty-result'
				});
			}
		}

		// if (fetching) {
		// 	items.push({
		// 		type: 'loader',
		// 		key: 'loader'
		// 	});
		// }

		return items;
	}

	renderProfileCard(userProfileId: number, profileName: string) {
		return (
			<View style={styles.profileCardContainer}>
				<ConnectedProfile
					onPhotoPress={() => this.openProfileScreen(userProfileId, profileName)}
					userProfileId={userProfileId}
				/>
			</View>
		);
	}

	renderItem(item: any) {
		switch (item.type) {
			case 'filter-tab':
				return <TabbedFilters />;
			case 'user-profile':
				return this.renderProfileCard(item.profileId, item.profileName);
			case 'loader':
				return <Throbber size="large" />;
			case 'selected-filters':
				return <SelectedFilter />;
			case 'empty-result':
				return <EmptyResult />;
			case 'purchase-button':
				return <ConnectedPurchaseButton label="Premium feature purchase plan" />;
			default:
				return null;
		}
	}

	async _handleMore() {
		this.logger.log('Trying to load more');
		const { mayBeFetchSearchResult, selectedScreen, isPaidScreen, isAccountPaid } = this.props;
		if (isPaidScreen && !isAccountPaid) return;
		if (!mayBeFetchSearchResult) return;
		await mayBeFetchSearchResult(selectedScreen);
	}

	async handleRefreshing() {
		const { clearSearchResultForScreen, selectedScreen } = this.props;
		await clearSearchResultForScreen(selectedScreen);
		await this._handleMore();
	}

	cycles = 0;

	render() {
		// console.log('explore re-rendering ', this.cycles++);
		const { fetching } = this.props;
		return (
			<View>
				<StatusBar backgroundColor="white" barStyle="dark-content" />
				<FlatList
					keyExtractor={(item: any) => item.key}
					data={this.getItems()}
					renderItem={({ item }) => this.renderItem(item)}
					onEndReached={this._handleMore}
					onEndReachedThreshold={0.5}
					refreshing={fetching}
					onRefresh={() => this.handleRefreshing()}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	navBarIcon: {
		paddingRight: 10
	},
	searchInput: {
		backgroundColor: Colors.borderColor,
		marginLeft: 5,
		marginRight: 10,
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10,
		height: 36,
		color: Colors.offWhite
	},
	avatar: {
		width: 36,
		height: 36,
		borderRadius: 18,
		margin: 10,
		// margin: 10,
		borderWidth: 1,
		borderColor: Colors.borderColor
	},
	header: {
		backgroundColor: 'white'
	},
	profileCardContainer: {
		// elevation: 10,
		marginBottom: 10,
		borderColor: 'black'
	}
});

const mapStateToProps = (state: IRootState) => {
	const selectedScreen = state.explore.selected_screen;
	const screen = state.explore[selectedScreen];
	const userProfiles = screen.profiles;
	const fetching = screen.fetching;
	const selectedFilter = getSearchFilter(state);
	return {
		selectedScreen,
		userProfiles,
		fetching,
		selectedFilter,
		isAccountPaid: isAccountPaid(state),
		isPaidScreen: isPaidScreen(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		mayBeFetchSearchResult: bindActionCreators(mayBeFetchSearchResult, dispatch),
		clearSearchResultForScreen: bindActionCreators(clearSearchResultForScreen, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ExploreScreen);
