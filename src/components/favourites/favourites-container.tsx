import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import {
	fetchFavouriteProfile,
	getFavouriteFetching,
	getFavouriteProfiles,
	getTotalElements,
	IFavouriteState,
	setFavouriteRefreshing
} from '../../store/reducers/favourite-reducer';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { toArray, sortBy, keys, isEmpty } from 'lodash';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { Favourite } from '../../store/reducers/account-defination';
import VirtualProfileList from '../virtual-profile-list/index';
import { getCurrentUserProfileId, isAccountPaid } from '../../store/reducers/account-reducer';
import Color from '../../constants/Colors';
import { Value } from '../text';
import EmptyResult from '../empty-result/empty-result';
import GlobalStyle from 'src/styles/global';

interface IFavouriteContainerMapStateToProps {
	userProfileId?: number;
	favouriteProfiles?: IFavouriteState;
	fetching?: boolean;
	totalFavourites: number;
	isAccountPaid: boolean;
}

interface IFavouriteContainerMapDispatchToProps {
	fetchFavouriteProfile: (id: number) => any;
	setFavouriteRefreshing: () => any;
}

type IFavouriteContainerProps = NavigationInjectedProps &
	IFavouriteContainerMapStateToProps &
	IFavouriteContainerMapDispatchToProps;

class FavouritesContainer extends React.Component<IFavouriteContainerProps> {
	constructor(props: IFavouriteContainerProps) {
		super(props);
		this._handleMore = this._handleMore.bind(this);
	}

	componentDidMount() {
		const { userProfileId, fetchFavouriteProfile } = this.props;
		if (userProfileId) {
			fetchFavouriteProfile(userProfileId);
		}
	}

	shouldComponentUpdate(nextProps: IFavouriteContainerProps) {
		const { favouriteProfiles, fetching } = this.props;
		const favouriteListChanged =
			keys(favouriteProfiles).length != keys(nextProps.favouriteProfiles).length;
		const isFetching = fetching != nextProps.fetching;
		return favouriteListChanged || isFetching;
	}

	getFavouriteProfiles(): Array<Favourite> {
		const { favouriteProfiles } = this.props;
		return sortBy(toArray(favouriteProfiles), 'createdOn').reverse();
	}

	profileIdExtractor(favourite: Favourite) {
		return favourite.favouriteUserProfile.id;
	}
	profileNameExtractor(favourite: Favourite) {
		return favourite.favouriteUserProfile.fullName;
	}

	async _handleMore() {
		const { userProfileId, fetchFavouriteProfile } = this.props;
		if (userProfileId) {
			await fetchFavouriteProfile(userProfileId);
		}
	}

	totalCount() {
		const { fetching, totalFavourites } = this.props;
		if (fetching) return null;
		return (
			<View style={styles.totalCountContainer}>
				<Value>{totalFavourites} Favourites</Value>
			</View>
		);
	}

	noFavourites() {
		return <EmptyResult text="You don't have any favourite" />;
	}

	async handleRefresh() {
		const { setFavouriteRefreshing } = this.props;
		await setFavouriteRefreshing();
		await this._handleMore();
	}

	isEmpty() {
		const profiles = this.getFavouriteProfiles();
		if (isEmpty(profiles)) return true;
		let blocked = true;
		for (let i = 0; i < profiles.length; i++) {
			if (!profiles[i].favouriteUserProfile.isBlocked) {
				blocked = false;
				break;
			}
		}
		return blocked;
	}

	render() {
		const { fetching, isAccountPaid } = this.props;
		const profiles = this.getFavouriteProfiles();
		return (
			<View style={GlobalStyle.expand}>
				<View style={GlobalStyle.expand}>
					<VirtualProfileList
						fetching={!!fetching}
						profileIdExtractor={this.profileIdExtractor}
						profileNameExtractor={this.profileNameExtractor}
						data={profiles}
						handleMore={this._handleMore}
						handleRefresh={() => this.handleRefresh()}
						isAccountPaid={isAccountPaid}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	emptyContainer: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	lightText: {
		color: Color.offWhite,
		fontSize: 18
	},
	totalCountContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 15
	}
});

const mapStateToProps = (state: IRootState) => {
	const userProfileId = getCurrentUserProfileId(state);
	const favouriteProfiles = getFavouriteProfiles(state);
	const fetching = getFavouriteFetching(state);
	const totalFavourites = getTotalElements(state);
	return {
		userProfileId,
		favouriteProfiles,
		fetching,
		totalFavourites,
		isAccountPaid: isAccountPaid(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchFavouriteProfile: bindActionCreators(fetchFavouriteProfile, dispatch),
		setFavouriteRefreshing: bindActionCreators(setFavouriteRefreshing, dispatch)
	};
};

const connectedFavouritesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FavouritesContainer);

export default withNavigation(connectedFavouritesContainer);
