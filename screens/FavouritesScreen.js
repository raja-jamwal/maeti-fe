import React from 'react';
import { ScrollView, View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import GlobalStyles from '../styles/global';
import ConnectedProfile from '../components/profile-card/connected-profile';
import _ from 'lodash';

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
				<ScrollView>
					{_.range(5).map(i => (
						<TouchableNativeFeedback key={i} onPress={this.openProfileScreen}>
							<View style={styles.profileCardContainer}>
								<ConnectedProfile accountId="c0bb90b3-d4ac-4007-b48c-3a70db934381" />
							</View>
						</TouchableNativeFeedback>
					))}
				</ScrollView>
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
