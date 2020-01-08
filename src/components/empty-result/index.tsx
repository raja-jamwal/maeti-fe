import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from 'src/constants/Colors';

class EmptyResult extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				{/*<Ionicons*/}
				{/*name="md-cafe"*/}
				{/*size={50}*/}
				{/*style={{ marginBottom: 5 }}*/}
				{/*color={Colors.tabIconDefault}*/}
				{/*/>*/}
				<Text style={styles.text}>No match found</Text>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: 200
	},
	text: {
		fontSize: 16,
		color: Colors.tabIconDefault
	}
});

export default EmptyResult;
