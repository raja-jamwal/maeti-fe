import * as React from 'react';
import { Text as ReactText } from 'react-native';
import GlobalStyles from '../../styles/global';
import * as _ from 'lodash';

const Text = (props: any) => {
	const styles = _.isArray(props.style) ? props.style : [props.style || {}];
	return <ReactText {...props} style={[styles]} />;
};

const Value = (props: any) => {
	const styles = [GlobalStyles.textRegular].concat(
		_.isArray(props.style) ? props.style : [props.style || {}]
	);
	return <Text {...props} style={[GlobalStyles.rightPaddedValue, styles]} />;
};

export default Text;
export { Value };
