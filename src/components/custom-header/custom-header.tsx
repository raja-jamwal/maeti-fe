import * as React from 'react';
import GlobalStyle from 'src/styles/global';
import Color from 'src/constants/Colors';
import { View, Text } from 'react-native';
import Button from '../button/button';
import { Updates } from 'expo';

export function CustomHeader({ title, btnLabel } = { title: '', btnLabel: '' }) {
	return (
		<View style={[GlobalStyle.row, GlobalStyle.alignCenter]}>
			<Text style={{ color: Color.offWhite, paddingRight: 16, fontSize: 16 }}>{title}</Text>
			<View style={GlobalStyle.expand} />
			<Button label={btnLabel} onPress={async () => await Updates.reloadFromCache()} />
		</View>
	);
}
