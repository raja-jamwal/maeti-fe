import * as React from 'react';
import {
	AppState,
	View,
	Text,
	Image,
	StyleSheet,
	Linking,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import GlobalStyle from 'src/styles/global';
import Button from '../button/button';
import { StackActions, NavigationActions, withNavigationFocus } from 'react-navigation';
import { simpleAlert } from '../alert/index';
import { isFormUpdateAllowed } from '../../utils/index';
import { modelRepository } from '../../utils/model-repository';
import { getLogger } from '../../utils/logger';
import { fetchAccountByPendingRequestId } from '../../store/reducers/account-reducer';
import { Throbber } from '../throbber/throbber';
const stayTunedImage = require('../../assets/login/stay-tuned.png');

export const StayTuned = withNavigationFocus(({ navigation }) => {
	const logger = getLogger(StayTuned);
	const [isCheckingStatus, setCheckingStatus] = React.useState(false);
	// number of times more, the form update is allowed
	const [updatesAllowed, setUpdatesAllowed] = React.useState(0);

	const openPhoneNumber = () => {
		Linking.openURL(`https://wa.me/917387778673`);
	};

	const checkAccountStatusFunc = async (showAlert = true) => {
		if (!modelRepository.id) {
			return logger.log('no modelRepository.id, not going to do anything');
		}
		try {
			setCheckingStatus(true);
			await fetchAccountByPendingRequestId(modelRepository.id);
		} catch (er) {
			if (showAlert) {
				const message = er.message || '';
				if (message === 'declined') {
					simpleAlert('Contact support', 'Please contact support for assistance.');
				} else {
					simpleAlert(
						'Pending approval',
						"Your profile is waiting for approval, please allow 1 business day. Once approved you'll receive account confirmation notification from us."
					);
				}
			}

			logger.log(er);
		} finally {
			setCheckingStatus(false);
		}
	};

	React.useEffect(() => {
		isFormUpdateAllowed().then(value => setUpdatesAllowed(value));
		const handleAppStateChange = () => checkAccountStatusFunc(false);
		AppState.addEventListener('change', handleAppStateChange);
		return () => {
			AppState.removeEventListener('change', handleAppStateChange);
		};
	}, []);

	const updateDetailFunc = async () => {
		const isUpdateAllowed = await isFormUpdateAllowed();
		simpleAlert(
			'Update details',
			`You can only update form ${isUpdateAllowed} more time.`,
			() => {
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
			},
			true
		);
	};

	return (
		<ScrollView>
			<View style={styles.container}>
				<View style={[GlobalStyle.row, GlobalStyle.justifyCenter]}>
					<Image source={stayTunedImage} resizeMode="contain" style={{ maxWidth: 300 }} />
				</View>
				<Text style={[styles.bold, styles.text]}>Account Under Review</Text>
				<Text style={styles.text}>
					Your account request is under review. Once your account is approved, you'll
					recieve account confirmation notification from us. Accounts are usually verified
					in 1 business day.
				</Text>
				{/*
                Make this appear after a while, ie after 2 hours
                */}
				{updatesAllowed <= 2 && (
					<View>
						<Text style={styles.text}>
							Please call or WhatsApp us at for assistance on
						</Text>
						<View style={[GlobalStyle.row, GlobalStyle.justifyCenter]}>
							<TouchableOpacity onPress={openPhoneNumber}>
								<Text style={styles.underline}>+91-73877-78673</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
				<View style={{ marginTop: 8 }}>
					{!isCheckingStatus && (
						<Button
							onPress={checkAccountStatusFunc}
							isPrimary={true}
							label={'Check account status'}
						/>
					)}
					{isCheckingStatus && <Throbber size="large" />}
					{!!updatesAllowed && (
						<View>
							<Text style={{ textAlign: 'center', margin: 8 }}>Or</Text>
							<Button
								onPress={updateDetailFunc}
								isPrimary={true}
								label={'Update Your Details'}
							/>
						</View>
					)}
				</View>
			</View>
		</ScrollView>
	);
});

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
