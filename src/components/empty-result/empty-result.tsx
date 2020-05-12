import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from 'src/constants/Colors';

interface IUserProfilePlaceholderProps {
	color: string;
}

function UserProfilePlaceholder(props: IUserProfilePlaceholderProps) {
	return (
		<View style={styles.container}>
			<View style={styles.subContainer}>
				<View style={[styles.firstCircle, { backgroundColor: props.color }]} />
				<View>
					<View style={[styles.firstRectangularBox, { backgroundColor: props.color }]} />
					<View style={[styles.secondRectangularBox, { backgroundColor: props.color }]} />
					<View style={[styles.thirdRectangularBox, { backgroundColor: props.color }]} />
				</View>
			</View>
		</View>
	);
}

interface IEmptyResultProps {
	text?: string;
}

function EmptyResult(props: IEmptyResultProps) {
	return (
		<View style={styles.mainContainer}>
			<UserProfilePlaceholder color={'rgb(190, 190, 190)'} />
			<UserProfilePlaceholder color={'rgb(232, 232, 232)'} />
			<View
				style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
			>
				<Text style={styles.text}>{props.text ? props.text : 'No Result Found!'}</Text>
				<Text style={styles.text}>Pull down to refresh</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		alignItems: 'center',
		justifyContent: 'flex-start'
	},
	text: {
		fontSize: 16,
		color: Colors.offWhite,
		paddingTop: 4
	},
	container: {
		flexDirection: 'column',
		justifyContent: 'flex-start',
		height: 52
	},
	subContainer: {
		flexDirection: 'row'
	},
	firstCircle: {
		width: 40,
		height: 40,
		borderRadius: 100,
		marginRight: 16
	},

	firstRectangularBox: {
		width: 100,
		height: 10,
		borderRadius: 4
	},

	secondRectangularBox: {
		width: 200,
		height: 7,
		borderRadius: 10,
		marginTop: 4
	},

	thirdRectangularBox: {
		width: 60,
		height: 5,
		borderRadius: 10,
		marginTop: 4
	}
});
export default EmptyResult;
