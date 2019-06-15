import * as React from 'react';
import { View, ScrollView, TouchableNativeFeedback, StyleSheet } from 'react-native';
import { bindActionCreators, Dispatch } from 'redux';
import { fetchFavouriteProfile, IFavouriteState } from '../../store/reducers/favourite-reducer';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { map } from 'lodash';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { Favourite } from '../../store/reducers/account-defination';
import ConnectedProfileCard from '../profile-card/connected-profile';
import { Throbber } from '../throbber/throbber';

interface IFavouriteContainerProps {}

interface IFavouriteContainerMapStateToProps {
	userProfileId?: number;
	favouriteProfiles?: IFavouriteState;
	fetching?: boolean;
}

interface IFavouriteContainerMapDispatchToProps {
	fetchFavouriteProfile: (id: number) => any;
}

class FavouritesContainer extends React.Component<
	NavigationInjectedProps &
		IFavouriteContainerProps &
		IFavouriteContainerMapStateToProps &
		IFavouriteContainerMapDispatchToProps
> {
	constructor(props: any) {
		super(props);
		this.openProfileScreen = this.openProfileScreen.bind(this);
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

	openProfileScreen(userProfileId: number) {
		console.log('openProfileScreen');
		const { navigation } = this.props;
		navigation.push('ProfileScreen', { userProfileId });
	}

	render() {
		const { favouriteProfiles, fetching } = this.props;
		return (
			<View>
				{!!fetching && (
					<View style={styles.loading}>
						<Throbber />
					</View>
				)}
				<ScrollView>
					{map(favouriteProfiles, (favourite: Favourite) => {
						return (
							<TouchableNativeFeedback
								key={favourite.favouriteProfile.id}
								onPress={() =>
									this.openProfileScreen(favourite.favouriteProfile.id)
								}
							>
								<View>
									<ConnectedProfileCard
										key={favourite.favouriteProfile.id}
										userProfileId={favourite.favouriteProfile.id}
									/>
								</View>
							</TouchableNativeFeedback>
						);
					})}
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		zIndex: 1,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

const mapStateToProps = (state: IRootState) => {
	const userProfileId =
		state.account && state.account.userProfile && state.account.userProfile.id;
	const favouriteProfiles = state.favourites.favourites;
	const fetching = state.favourites.fetching;
	return {
		userProfileId,
		favouriteProfiles,
		fetching
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
