import * as React from 'react';
import EmptyCanavas from 'src/components/empty-result/emptyResultCanavas';
import Colors from 'src/constants/Colors';
import { View, Text, StyleSheet } from 'react-native';

class EmptyResult extends React.Component {
	constructor(props: any) {
		super(props);
	}

	render() {
		let { text } = this.props;
		if (!text) {
			text = 'No result Found!';
		}
		return (
			<View style={styles.container}>
				<EmptyCanavas />
				<View>
					<Text style={styles.text}>{text}</Text>
				</View>
			</View>
		);
	}
}
const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 150
	},
	text: {
		position: 'relative',
		fontSize: 16,
		color: 'rgb(180, 180, 180)'
	}
});
export default EmptyResult;
