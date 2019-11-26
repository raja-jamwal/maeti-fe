import * as React from 'react';
import { Text, TouchableNativeFeedback, View, StyleSheet } from 'react-native';
import Color from 'src/constants/Colors';

interface IButtonProps {
	label: string;
	onPress: () => any;
	style?: any;
}

export default class Button extends React.PureComponent<IButtonProps> {
	render() {
		const { label, onPress, style } = this.props;
		const containerStyle = {
			...styles.btnContainer,
			...(style || {})
		};
		return (
			<TouchableNativeFeedback onPress={() => onPress()}>
				<View style={containerStyle}>
					<Text style={styles.label}>{label}</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}
}

const styles = StyleSheet.create({
	btnContainer: {
		backgroundColor: 'white',
		padding: 8,
		paddingLeft: 32,
		paddingRight: 32,
		borderRadius: 6,
		elevation: 2,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	label: {
		color: Color.offWhite
	}
});
