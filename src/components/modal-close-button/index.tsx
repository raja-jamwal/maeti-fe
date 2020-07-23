import * as React from 'react';
import Color from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export function ModalCloseButton() {
	return (
		// <View
		// 	style={{
		// 		padding: 8,
		// 		paddingLeft: 12,
		// 		paddingRight: 12
		// 	}}
		// >
		<Ionicons name="md-close" size={30} color={Color.offWhite} />
		// </View>
	);
}
