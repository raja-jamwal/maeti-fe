import * as React from 'react';
import Colors from '../constants/Colors';
import InterestsTab from '../components/interests-tab/index';

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
