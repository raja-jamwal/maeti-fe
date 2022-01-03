import * as React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import GlobalStyles from '../../styles/global';
import Layout from 'src/constants/Layout.js';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Color from '../../constants/Colors';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { pickPhotoFromGallery } from '../../utils/image-upload-service';
import { Throbber } from '../throbber/throbber';
import { modelRepository } from '../../utils/model-repository';
import { IOtpState } from '../../store/reducers/otp-reducer';
import { NavigationActions, StackActions } from 'react-navigation';
import * as Permissions from 'expo-permissions';
import { getLogger } from '../../utils/logger';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';
import { ApiRequest } from '../../utils';
import { API } from '../../config/API';
import { simpleAlert } from '../alert/index';
import { markFormUpdate } from '../../utils/index';
import { get } from 'lodash';

const defaultPrimaryPhoto = require('../../assets/images/placeholder.png');

const groomOrBridge = () => {
	if (modelRepository.userProfile.createdBy !== 'self') {
		return 'your';
	}
	return modelRepository.userProfile.gender === 'male' ? "groom's" : "bride's";
};

export function UploadPhoto({ navigation }: any) {
	const logger = getLogger(UploadPhoto);
	const [isUploading, setIsUploading] = React.useState(false);
	const [isCreatingAccount, setIsCreatingAccount] = React.useState(false);
	const [uploadedPhoto, setUploadedPhoto] = React.useState((!!modelRepository.userProfilePhoto
		? modelRepository.userProfilePhoto
		: null) as (string | null));

	const startPhotoUpload = async () => {
		setIsUploading(true);
		const url = await pickPhotoFromGallery();
		if (!!url) {
			modelRepository.setProfilePhoto(url);
			setUploadedPhoto(url);
		}
		setIsUploading(false);
	};

	const image = !!uploadedPhoto
		? {
				uri: uploadedPhoto,
				width: Layout.window.width
		  }
		: defaultPrimaryPhoto;

	const goToReviewScreen = () => {
		navigation.dispatch(
			StackActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({
						routeName: 'UnderReviewScreen'
					})
				]
			})
		);
	};

	return (
		<SafeAreaView style={GlobalStyles.expand}>
			<TouchableOpacity onPress={startPhotoUpload}>
				<View>
					<Image
						loadingIndicatorSource={defaultPrimaryPhoto}
						progressiveRenderingEnabled={true}
						source={image}
						style={styles.profileImage}
					/>
				</View>
			</TouchableOpacity>
			<View
				style={[
					GlobalStyles.expand,
					GlobalStyles.column,
					GlobalStyles.alignCenter,
					GlobalStyles.justifyCenter,
					{
						margin: 16
					}
				]}
			>
				{isUploading && <Throbber size="large" />}
				{!isUploading && (
					<View>
						<Text style={[styles.bold, styles.center]}>Touch the image above to</Text>
						<Text style={[styles.bold, styles.center]}>
							upload {groomOrBridge()} picture
						</Text>
						<Text style={[styles.center, { marginTop: 16 }]}>
							Uploaded image are subjected to verification, account with fake image
							are immediatedly rejected
						</Text>
					</View>
				)}
			</View>
			{uploadedPhoto && (
				<View style={styles.submissionFooter}>
					{!isCreatingAccount && (
						<TouchableBtn
							onPress={async () => {
								const createPendingRequest = () => {
									return new Promise(async (resolve, reject) => {
										setIsCreatingAccount(true);
										// mark the form as updated
										await markFormUpdate();
										// get the expo token
										const {
											status: existingStatus
										} = await Permissions.getAsync(Permissions.NOTIFICATIONS);
										logger.log('existingStatus ', existingStatus);

										let finalStatus = existingStatus;

										// only ask if permissions have not already been determined, because
										// iOS won't necessarily prompt the user a second time.
										if (existingStatus !== 'granted') {
											// Android remote notification permissions are granted during the app
											// install, so this will only ask on iOS
											const { status } = await Permissions.askAsync(
												Permissions.NOTIFICATIONS
											);
											finalStatus = status;
										}

										let token = null;
										try {
											// Get the token that uniquely identifies this device
											token = await Notifications.getExpoPushTokenAsync();
											logger.log('push token ', token);
											modelRepository.setExpoToken(token.data);
										} catch (err) {
											logger.log('unable to get push token ', err);
										}

										try {
											// call a new mayBe create account API call
											const payload = {
												phoneNumber: modelRepository.phoneNumber,
												photoUrl: modelRepository.userProfilePhoto,
												pushToken: modelRepository.expoToken,
												userProfileString: JSON.stringify(
													modelRepository.userProfile
												)
											};
											// console.log(payload);
											const response = (await ApiRequest(
												API.PENDING_ACCOUNT.CREATE,
												payload
											)) as any;
											console.log(response.id);
											// <-> pendingAccount returns Id
											// update modelRepository with a id
											modelRepository.setId(response.id);
											// save the model Repository in localCache
											modelRepository.save();
											resolve(modelRepository);
											goToReviewScreen();
										} catch (er) {
											logger.log(er);
											const statusCode = get(er, 'status');
											if (statusCode === 404) {
												simpleAlert(
													'Existing account',
													'Please sign-in with your number',
													async () => {
														modelRepository.delete();
														await Updates.reloadAsync();
													}
												);
											} else {
												simpleAlert('Error', 'Unable to process');
											}
											reject();
										}
										setIsCreatingAccount(false);
									});
								};
								if (!modelRepository.phoneNumber) {
									navigation.push('Verification', {
										onVerification: (otpState: IOtpState) => {
											modelRepository.setPhoneNumber(
												`${otpState.callingCode}-${otpState.number}`
											);
											return createPendingRequest();
										}
									});
								} else {
									await createPendingRequest();
									goToReviewScreen();
								}
							}}
						>
							<Text style={styles.submissionBtn}>Continue</Text>
						</TouchableBtn>
					)}
					{!!isCreatingAccount && <Throbber size="large" />}
				</View>
			)}
		</SafeAreaView>
	);
}

UploadPhoto['navigationOptions'] = ({ navigation }: any) => {
	return {
		title: `Upload ${groomOrBridge()} Photo`
	};
};

const styles = StyleSheet.create({
	profileImage: {
		width: Layout.window.width,
		height: Layout.window.height / 2
	},
	submissionFooter: {
		backgroundColor: 'white',
		padding: 8,
		borderTopWidth: 1,
		borderColor: Color.tabIconDefault
	},
	submissionBtn: {
		backgroundColor: Color.primaryDarkColor,
		padding: 6,
		textAlign: 'center',
		color: 'white',
		margin: 4,
		borderRadius: 4,
		fontSize: 16
	},
	bold: {
		fontWeight: 'bold',
		fontSize: 18
	},
	center: {
		textAlign: 'center'
	}
});
