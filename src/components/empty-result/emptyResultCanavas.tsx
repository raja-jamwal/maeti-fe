import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class EmptyCanavas extends React.Component {
	constructor(props: any) {
		super(props);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.subContainer}>
					<View style={styles.firstCircle} />
					<View style={styles.childContainer}>
						<View style={styles.firstRectangularBox} />
						<View style={styles.secondRectangularBox} />
						<View style={styles.thirdRectangularBox} />
					</View>
				</View>
				<View style={styles.subContainer}>
					<View style={styles.secondCircle} />
					<View style={styles.childContainer}>
						<View style={styles.firstSecondRectangularBox} />
						<View style={styles.secondSecondRectangularBox} />
						<View style={styles.thirdSecondRectangularBox} />
					</View>
				</View>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 100
	},
	subContainer: {
		flexDirection: 'row',
		alignItems: 'stretch',
		height: 40
	},
	childContainer: {
		backgroundColor: 'white',
		flexDirection: 'column',
		justifyContent: 'space-around',
		alignSelf: 'flex-end',
		alignItems: 'stretch',
		height: 40
	},
	firstCircle: {
		backgroundColor: 'rgb(180, 180, 180)',
		width: 40,
		height: 40,
		borderRadius: 100,
		alignSelf: 'flex-start',
		marginLeft: 50,
		marginRight: 20
	},
	secondCircle: {
		backgroundColor: 'rgb(232, 232, 232)',
		width: 40,
		height: 40,
		borderRadius: 100,
		alignSelf: 'flex-start',
		marginLeft: 50,
		marginRight: 20
	},
	firstRectangularBox: {
		backgroundColor: 'rgb(180, 180, 180)',
		width: 100,
		height: 10,
		borderRadius: 4,
		marginRight: 210
	},
	firstSecondRectangularBox: {
		backgroundColor: 'rgb(232, 232, 232)',
		width: 100,
		height: 10,
		borderRadius: 4,
		marginRight: 210
	},
	secondRectangularBox: {
		backgroundColor: 'rgb(180, 180, 180)',
		width: 200,
		height: 7,
		borderRadius: 10
	},
	secondSecondRectangularBox: {
		backgroundColor: 'rgb(232, 232, 232)',
		width: 200,
		height: 7,
		borderRadius: 10
	},
	thirdRectangularBox: {
		backgroundColor: 'rgb(180, 180, 180)',
		width: 60,
		height: 5,
		borderRadius: 10,
		marginRight: 1
	},
	thirdSecondRectangularBox: {
		backgroundColor: 'rgb(232, 232, 232)',
		width: 60,
		height: 5,
		borderRadius: 10,
		marginRight: 1
	}
});
export default EmptyCanavas;
