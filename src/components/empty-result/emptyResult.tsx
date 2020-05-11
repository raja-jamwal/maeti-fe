import * as React from 'react';
import Colors from 'src/constants/Colors';
import { View, Text, StyleSheet } from 'react-native';

function UserProfilePlaceholder(props: any) {
	return (
		<View style={styles.container}>
			<View style={styles.subContainer}>
				<View style={[styles.firstCircle, { backgroundColor: props.color }]} />
				<View style={styles.childContainer}>
					<View style={[styles.firstRectangularBox, { backgroundColor: props.color }]} />
					<View style={[styles.secondRectangularBox, { backgroundColor: props.color }]} />
					<View style={[styles.thirdRectangularBox, { backgroundColor: props.color }]} />
				</View>
			</View>
		</View>
	);
}
function EmptyResult(props: any) {
	return (
		<View style={styles.mainContainer}>
			<UserProfilePlaceholder color={'rgb(180, 180, 180)'} />
			<UserProfilePlaceholder color={'rgb(232, 232, 232)'} />
			<View>
				<Text style={styles.text}>{props.text ? props.text : 'No Result Found!'}</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 150
	},
	text: {
		position: 'relative',
		fontSize: 16,
		color: 'rgb(180, 180, 180)'
	},
	container: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 50
	},
	subContainer: {
		flexDirection: 'row',
		alignItems: 'stretch',
		height: 40
	},
	childContainer: {
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignSelf: 'flex-end',
		alignItems: 'stretch',
		height: 40
	},
	firstCircle: {
		width: 40,
		height: 40,
		borderRadius: 100,
		alignSelf: 'flex-start',
		marginLeft: 50,
		marginRight: 20
	},

	firstRectangularBox: {
		width: 100,
		height: 10,
		borderRadius: 4,
		marginRight: 210
	},

	secondRectangularBox: {
		width: 200,
		height: 7,
		borderRadius: 10
	},

	thirdRectangularBox: {
		width: 60,
		height: 5,
		borderRadius: 10,
		marginRight: 1
	}
});
export default EmptyResult;
