import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../components/text/index';
import Colors from '../constants/Colors';

export default class MoreScreen extends React.Component {
	static navigationOptions = {
		title: 'More'
	};
	render() {
		return (
			<View style={styles.container}>
				<Text style={[styles.title]}>Rishto v0.1</Text>
				<Text style={styles.offWhite}>Sindhyun jo Sindhyun sa</Text>
				<Text style={styles.offWhite}>For support & help contact</Text>
				<Text style={styles.offWhite}>feedback@domain.com</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 20
	},
	offWhite: {
		color: Colors.offWhite
	}
});
