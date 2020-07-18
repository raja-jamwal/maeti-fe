import * as React from 'react';
import { View, Text, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import GlobalStyle from 'src/styles/global';
import Button from '../button/button';
import { StackActions, NavigationActions } from 'react-navigation';
const stayTunedImage = require('../../assets/login/stay-tuned.png');

export function StayTuned({ navigation }) {
	const openPhoneNumber = () => {
		Linking.openURL(`https://wa.me/917387778673`);
	};
	return (
		<View style={styles.container}>
			<Image source={stayTunedImage} resizeMode="center" />
			<Text style={[styles.bold, styles.text]}>Stay Tuned</Text>
			<Text style={styles.text}>
				Your account request is under review. Once your account is approved, you'll recieve
				account confirmation notification from us. Accounts are usually verified in 1
				business day.
			</Text>
			{/*
                Make this appear after a while, ie after 2 hours
                */}
			<View>
				<Text style={styles.text}>Please call or WhatsApp us at for assistance on</Text>
				<View style={[GlobalStyle.row, GlobalStyle.justifyCenter]}>
					<TouchableOpacity onPress={openPhoneNumber}>
						<Text style={styles.underline}>+91-73877-78673</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View style={{ marginTop: 8 }}>
				<Button
					onPress={() => {
						navigation.dispatch(
							StackActions.reset({
								index: 0,
								actions: [
									NavigationActions.navigate({
										routeName: 'FormScreen'
									})
								]
							})
						);
					}}
					isPrimary={true}
					label={'Update Your Details'}
				/>
			</View>
		</View>
	);
}

StayTuned['navigationOptions'] = () => {
	return {
		title: 'Account under review'
	};
};

const styles = StyleSheet.create({
	container: {
		margin: 16
	},
	bold: {
		fontSize: 20,
		fontWeight: '500'
	},
	text: {
		textAlign: 'center',
		paddingBottom: 10
	},
	underline: {
		textDecorationLine: 'underline'
	}
});
