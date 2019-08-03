import * as React from 'react';
import Colors from '../../constants/Colors';
import { ActivityIndicator } from 'react-native';

interface IProps {
	size: string;
}

export const Throbber = (props: IProps) => {
	const size = props.size ? props.size : 'large';
	return <ActivityIndicator size={size} color={Colors.primaryDarkColor} />;
};
