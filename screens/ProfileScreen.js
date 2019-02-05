import React from 'react';
import { View } from 'react-native';
import ProfileInfoTab from '../components/profile-info-tab';
import GlobalStyles from '../styles/global';

export default class ProfileScreen extends React.Component {
	static navigationOptions = {
		title: 'My Profile'
	};

	render() {
		return (
			<View style={GlobalStyles.expand}>
				<ProfileInfoTab />
			</View>
		);
	}
}
