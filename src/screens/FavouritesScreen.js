import React from 'react';
import { ScrollView, View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import GlobalStyles from '../styles/global';
import ConnectedProfile from '../components/profile-card/connected-profile';
import _ from 'lodash';
import FavouritesContainer from '../components/favourites/favourites-container';

export default class FavouritesScreen extends React.Component {
	static navigationOptions = {
		title: 'Favourites'
	};

	constructor(props) {
		super(props);
		this.openProfileScreen = this.openProfileScreen.bind(this);
	}

	openProfileScreen() {
		const { navigation } = this.props;
		navigation.push('ProfileScreen');
	}

	render() {
		return (
			<View style={GlobalStyles.expand}>
				<FavouritesContainer />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	profileCardContainer: {
		elevation: 10,
		marginBottom: 10,
		borderColor: 'black'
	}
});
