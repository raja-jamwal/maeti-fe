import React from 'react';
import { View } from 'react-native';
import Text from '../components/text';
import Colors from '../constants/Colors';
import InterestsTab from '../components/interests-tab';

export default class InterestsScreen extends React.Component {
	static navigationOptions = {
		title: 'Interests',
		headerStyle: {
			backgroundColor: Colors.primaryDarkColor,
			elevation: 0
		}
	};

	render() {
		return <InterestsTab />;
	}
}
