import * as React from 'react';
import { View, Text, Modal, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import Color from '../../constants/Colors';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { Ionicons } from '@expo/vector-icons';
import GlobalStyle from 'src/styles/global';
import { noop } from 'lodash';
import { Eula } from './eula';
import { Policy } from './policy';

export function TosModal(
	{ showModal, toggleShowModal, isEula } = {
		showModal: false,
		toggleShowModal: noop,
		isEula: false
	}
) {
	return (
		<Modal animationType="slide" visible={showModal} onRequestClose={toggleShowModal}>
			<SafeAreaView style={GlobalStyle.expand}>
				<StatusBar backgroundColor={Color.white} barStyle="dark-content" />
				<View>
					<View style={style.titleBar}>
						<Text style={style.title}>
							{isEula ? 'Terms of Use' : 'Privacy Policy'}
						</Text>
						<TouchableBtn onPress={toggleShowModal}>
							<View style={style.closeBtnContainer}>
								<Ionicons name="md-close" size={26} color={Color.offWhite} />
							</View>
						</TouchableBtn>
					</View>
				</View>
				{isEula && <Eula />}
				{!isEula && <Policy />}
			</SafeAreaView>
		</Modal>
	);
}

const style = StyleSheet.create({
	titleBar: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		fontSize: 18,
		color: Color.black,
		textAlign: 'center',
		flex: 1
	},
	closeBtnContainer: {
		padding: 8,
		paddingLeft: 16,
		paddingRight: 16
	}
});
