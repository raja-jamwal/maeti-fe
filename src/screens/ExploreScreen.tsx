import * as React from 'react';
import {
	Image,
	StyleSheet,
	TextInput,
	View,
	TouchableNativeFeedback,
	FlatList
} from 'react-native';
import Colors from '../constants/Colors';
import GlobalStyles from '../styles/global';
import ConnectedProfile from '../components/profile-card/connected-profile';
import { Icon } from 'expo';
import TabbedFilters from '../components/tabbed-filters/index';
import { connect } from 'react-redux';
import { Throbber } from '../components/throbber/throbber';
import { NavigationInjectedProps } from 'react-navigation';
import { IUserProfileState } from '../store/reducers/user-profile-reducer';
import { IRootState } from '../store';
import { bindActionCreators, Dispatch } from 'redux';
import { mayBeFetchSearchResult } from '../store/reducers/explore-reducer';
import { toArray, sortBy } from 'lodash';
import { getSearchFilter } from '../store/reducers/filter-reducer';
import { getLogger } from '../utils/logger';

interface IExploreScreenProps {
	userProfiles: IUserProfileState;
	fetching: boolean;
	selectedScreen: string;
	mayBeFetchSearchResult: (screen: string) => any;
	selectedFilter: any;
}

const CustomHeader = (props: any) => {
	const navigateToProfile = () => null; // props.navigation.push('ProfileScreen');
	const openFilterScreen = () => props.navigation.push('FilterScreen');
	return (
		<View style={[GlobalStyles.row, GlobalStyles.alignCenter, styles.header]}>
			<TouchableNativeFeedback onPress={() => navigateToProfile()}>
				<Image source={require('../assets/images/robot-dev.png')} style={styles.avatar} />
			</TouchableNativeFeedback>
			<TextInput style={[GlobalStyles.expand, styles.searchInput]} />
			<TouchableNativeFeedback>
				<Icon.Ionicons
					style={styles.navBarIcon}
					color={Colors.white}
					name="md-save"
					size={26}
				/>
			</TouchableNativeFeedback>
			<TouchableNativeFeedback onPress={() => openFilterScreen()}>
				<Icon.Ionicons
					style={styles.navBarIcon}
					color={Colors.white}
					name="md-funnel"
					size={26}
				/>
			</TouchableNativeFeedback>
		</View>
	);
};

class ExploreScreen extends React.PureComponent<NavigationInjectedProps & IExploreScreenProps> {
	private logger = getLogger(ExploreScreen);

	static navigationOptions = {
		title: 'Explore',
		header: CustomHeader
	};

	constructor(props: any) {
		super(props);
		this.openProfileScreen = this.openProfileScreen.bind(this);
		this._handleMore = this._handleMore.bind(this);
	}

	openProfileScreen(userProfileId: number) {
		const { navigation } = this.props;
		navigation.push('ProfileScreen', { userProfileId });
	}

	getItems() {
		const { userProfiles, fetching } = this.props;
		const items: any = [
			{
				type: 'filter-tab',
				key: 'filter-tab'
			}
		];

		sortBy(toArray(userProfiles), 'updatedOn')
			.reverse()
			.forEach(userProfile => {
				const userProfileId = userProfile.id;
				items.push({
					type: 'user-profile',
					key: `profile-${userProfileId}`,
					profileId: userProfileId
				});
			});

		if (fetching) {
			items.push({
				type: 'loader',
				key: 'loader'
			});
		}

		return items;
	}

	renderProfileCard(userProfileId: number) {
		return (
			<TouchableNativeFeedback
				key={userProfileId}
				onPress={() => this.openProfileScreen(userProfileId)}
			>
				<View style={styles.profileCardContainer}>
					<ConnectedProfile userProfileId={userProfileId} />
				</View>
			</TouchableNativeFeedback>
		);
	}

	renderItem(item: any) {
		switch (item.type) {
			case 'filter-tab':
				return <TabbedFilters />;
			case 'user-profile':
				return this.renderProfileCard(item.profileId);
			case 'loader': {
				return <Throbber />;
			}
			default:
				return null;
		}
	}

	_handleMore() {
		this.logger.log('Trying to load more');
		const { mayBeFetchSearchResult, selectedScreen } = this.props;
		if (!mayBeFetchSearchResult) return;
		mayBeFetchSearchResult(selectedScreen);
	}

	cycles = 0;

	render() {
		// console.log('explore re-rendering ', this.cycles++);
		return (
			<FlatList
				keyExtractor={(item: any) => item.key}
				data={this.getItems()}
				renderItem={({ item }) => this.renderItem(item)}
				onEndReached={this._handleMore}
				onEndReachedThreshold={0.5}
			/>
		);
	}
}

const styles = StyleSheet.create({
	navBarIcon: {
		paddingRight: 10
	},
	searchInput: {
		backgroundColor: Colors.tintColor,
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10,
		color: 'white'
	},
	avatar: {
		width: 26,
		height: 26,
		borderRadius: 20,
		margin: 10,
		borderWidth: 3,
		// padding: 10,
		borderColor: 'white'
	},
	header: {
		backgroundColor: Colors.primaryDarkColor
	},
	profileCardContainer: {
		elevation: 10,
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
		selectedFilter
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		mayBeFetchSearchResult: bindActionCreators(mayBeFetchSearchResult, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ExploreScreen);
