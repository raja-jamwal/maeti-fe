import * as React from 'react';
import {
	Text,
	TouchableNativeFeedback,
	View,
	StyleSheet,
	TouchableOpacity,
	Platform
} from 'react-native';
import Color from 'src/constants/Colors';
import { IS_IOS } from '../../utils';

interface IButtonProps {
	label: string;
	onPress: () => any;
	style?: any;
	labelStyle?: any;
}

export default class Button extends React.PureComponent<IButtonProps> {
	renderBtnView() {
		const { label, style } = this.props;
		const containerStyle = {
			...styles.btnContainer,
			...(style || {})
		};
		const labelSyle = Object.assign({}, styles.label, this.props.labelStyle || {});
		return (
			<View style={containerStyle}>
				<Text style={labelSyle}>{label}</Text>
			</View>
		);
	}

	render() {
		const { onPress } = this.props;

		if (IS_IOS) {
			return (
				<TouchableOpacity onPress={() => onPress()}>
					{this.renderBtnView()}
				</TouchableOpacity>
			);
		}

		return (
			<TouchableNativeFeedback onPress={() => onPress()}>
				{this.renderBtnView()}
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
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		...Platform.select({
			ios: {
				shadowOpacity: 0.2,
				shadowRadius: 1,
				shadowOffset: {
					height: 0,
					width: 0
				}
			},
			android: {
				elevation: 2
			}
		})
	},
	label: {
		color: Color.offWhite
	}
});
