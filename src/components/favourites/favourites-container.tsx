import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import {
	fetchFavouriteProfile,
	getFavouriteFetching,
	getFavouriteProfiles,
	getTotalElements,
	IFavouriteState
} from '../../store/reducers/favourite-reducer';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { toArray, sortBy, keys } from 'lodash';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { Favourite } from '../../store/reducers/account-defination';
import VirtualProfileList from '../virtual-profile-list/index';
import { getCurrentUserProfileId } from '../../store/reducers/account-reducer';

interface IFavouriteContainerMapStateToProps {
	userProfileId?: number;
	favouriteProfiles?: IFavouriteState;
	fetching?: boolean;
	totalFavourites: number;
}

interface IFavouriteContainerMapDispatchToProps {
	fetchFavouriteProfile: (id: number) => any;
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
	const userProfileId = getCurrentUserProfileId(state);
	const favouriteProfiles = getFavouriteProfiles(state);
	const fetching = getFavouriteFetching(state);
	const totalFavourites = getTotalElements(state);
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
