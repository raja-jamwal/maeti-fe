import * as React from 'react';
import { View, Text, TouchableNativeFeedback, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { Icon } from 'expo';

class InterestMessageBar extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<View style={styles.barContainer}>
					<TouchableNativeFeedback onPress={() => null}>
						<View style={styles.btnContainer}>
							<Icon.Ionicons name="md-flash" size={20} color="white" />
							<Text style={styles.text}>Show Interest</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={() => null}>
						<View style={styles.btnContainer}>
							<Icon.Ionicons name="md-chatboxes" size={20} color="white" />
							<Text style={styles.text}>Message</Text>
						</View>
					</TouchableNativeFeedback>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 0,
		elevation: 10,
		backgroundColor: 'white'
	},
	barContainer: {
		flexDirection: 'row'
	},
	btnContainer: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: Colors.pink,
		margin: 8,
		padding: 5,
		paddingLeft: 15,
		borderRadius: 10
	},
	text: {
		color: 'white',
		paddingLeft: 20
	}
});

export default InterestMessageBar;
