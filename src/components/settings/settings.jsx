import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import { noop } from 'lodash';
import { Ionicons } from '@expo/vector-icons';

export function SettingRow({ label, value, action } = { label: '', value: '', action: null }) {
	return (
		<View style={styles.settingRow}>
			<Text style={styles.settingLabel}>{label}</Text>
			{!!value && <Text style={styles.settingValue}>{value}</Text>}
			{!!action && (
				<TouchableOpacity style={styles.settingActionContainer} onPress={() => action()}>
					<Ionicons color={Colors.offWhite} name="ios-arrow-forward" size={20} />
				</TouchableOpacity>
			)}
		</View>
	);
}

export function SettingPara({ children } = { children: null }) {
	return <Text style={styles.settingPara}>{children}</Text>;
}

export function SettingDivider() {
	return <View style={styles.settingDivider} />;
}

export function SettingBlock({ children } = { children: null }) {
	return <View style={styles.settingBlock}>{children}</View>;
}

export function SettingTitle({ label } = { label: '' }) {
	return <Text style={styles.settingTitle}>{label}</Text>;
}

const styles = StyleSheet.create({
	settingPara: {
		color: Colors.offWhite,
		padding: 14
	},
	settingDivider: {
		marginLeft: 14,
		borderTopColor: Colors.borderColor,
		borderTopWidth: 1,
		flex: 1
	},
	settingActionContainer: {
		flex: 1,
		flexDirection: 'row-reverse'
	},
	settingRow: {
		flexDirection: 'row',
		padding: 14
	},
	settingValue: {
		textAlign: 'right',
		color: Colors.offWhite,
		flex: 1
	},
	settingLabel: {
		color: 'rgb(20, 22, 23)',
		fontWeight: '400'
	},
	settingBlock: {
		backgroundColor: Colors.white
	},
	settingTitle: {
		margin: 16,
		fontSize: 16,
		fontWeight: 'bold',
		color: 'rgb(100, 120, 133)'
	}
});
