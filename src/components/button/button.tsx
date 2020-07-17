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
	isPrimary?: boolean;
}

export default class Button extends React.PureComponent<IButtonProps> {
	renderBtnView() {
		const { label, style, isPrimary } = this.props;
		const containerStyle = {
			...(isPrimary ? styles.primaryBtnContainer : styles.btnContainer),
			...(style || {})
		};
		const labelSyle = [
			isPrimary ? styles.primaryLabel : styles.label,
			this.props.labelStyle || {}
		];
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
	primaryBtnContainer: {
		backgroundColor: Color.primaryDarkColor
	},
	label: {
		color: Color.offWhite
	},
	primaryLabel: {
		padding: 6,
		textAlign: 'center',
		color: 'white',
		margin: 4,
		borderRadius: 4,
		fontSize: 16
	}
});
