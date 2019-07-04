import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { fetchFavouriteProfile, IFavouriteState } from '../../store/reducers/favourite-reducer';
import { connect } from 'react-redux';
import { IRootState } from '../../store/index';
import { toArray, sortBy } from 'lodash';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { Favourite } from '../../store/reducers/account-defination';
import VirtualProfileList from '../virtual-profile-list/index';

interface IFavouriteContainerProps {}

interface IFavouriteContainerMapStateToProps {
	userProfileId?: number;
	favouriteProfiles?: IFavouriteState;
	fetching?: boolean;
	totalFavourites: number;
}

interface IFavouriteContainerMapDispatchToProps {
	fetchFavouriteProfile: (id: number) => any;
}

interface IFavouriteContainerState {
	isFetchingMore: boolean;
}

class FavouritesContainer extends React.Component<
	NavigationInjectedProps &
		IFavouriteContainerProps &
		IFavouriteContainerMapStateToProps &
		IFavouriteContainerMapDispatchToProps,
	IFavouriteContainerState
> {
	constructor(props: any) {
		super(props);
		this._handleMore = this._handleMore.bind(this);
	}

	componentDidMount() {
		// given the userId of the account
		// pull all the favourite profiles
		// add them favourite reducer - id: { }
		// add profiles pull from favourite to
		// userProfiles too.
		const { userProfileId, fetchFavouriteProfile } = this.props;
		if (userProfileId) {
			fetchFavouriteProfile(userProfileId);
		}
	}

	getFavouriteProfiles(): Array<Favourite> {
		const { favouriteProfiles } = this.props;
		return sortBy(toArray(favouriteProfiles), 'updatedOn');
	}

	profileIdExtractor(favourite: Favourite) {
		return favourite.favouriteUserProfile.id;
	}

	_handleMore() {
		const { userProfileId, fetchFavouriteProfile } = this.props;
		if (userProfileId) {
			fetchFavouriteProfile(userProfileId);
		}
	}

	totalCount() {
		const { fetching, totalFavourites } = this.props;
		if (fetching) return null;
		return (
			<View style={styles.totalCountContainer}>
				<Text>{totalFavourites} Favourites</Text>
			</View>
		);
	}

	render() {
		const { fetching } = this.props;
		return (
			<VirtualProfileList
				fetching={fetching}
				profileIdExtractor={this.profileIdExtractor}
				data={this.getFavouriteProfiles()}
				headerComponent={this.totalCount()}
				handleMore={this._handleMore}
			/>
		);
	}
}

const styles = StyleSheet.create({
	totalCountContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 15
	}
});

const mapStateToProps = (state: IRootState) => {
	const userProfileId =
		state.account && state.account.userProfile && state.account.userProfile.id;
	const favouriteProfiles = state.favourites.favourites;
	const fetching = state.favourites.fetching;
	const totalFavourites = state.favourites.pageable.totalElements;

	return {
		userProfileId,
		favouriteProfiles,
		fetching,
		totalFavourites
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchFavouriteProfile: bindActionCreators(fetchFavouriteProfile, dispatch)
	};
};

const connectedFavouritesContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(FavouritesContainer);

export default withNavigation(connectedFavouritesContainer);
