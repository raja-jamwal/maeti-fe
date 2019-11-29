import * as React from 'react';
import { TouchableNativeFeedback, TouchableOpacity } from 'react-native';
import { IS_IOS } from '../../utils';

export default class TouchableBtn extends React.PureComponent<any> {
	render() {
		if (IS_IOS)
			return <TouchableOpacity {...this.props}>{this.props.children}</TouchableOpacity>;
		return (
			<TouchableNativeFeedback {...this.props}>{this.props.children}</TouchableNativeFeedback>
		);
	}
}
