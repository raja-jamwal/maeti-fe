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

const defaultPrimaryPhoto = require('../../assets/images/placeholder.png');

const groomOrBridge = () => {
	if (modelRepository.userProfile.createdBy !== 'self') {
		return 'your';
	}
	return modelRepository.userProfile.gender === 'male' ? "groom's" : "bride's";
};

export function UploadPhoto({ navigation }) {
	const [isUploading, setIsUploading] = React.useState(false);
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
					<TouchableBtn
						onPress={() => {
							navigation.push('Verification', {
								onVerification: (otpState: IOtpState) => {
									return new Promise((resolve, reject) => {
										console.log('modelRepository ', modelRepository);
										setTimeout(resolve, 5 * 1000);
										navigation.dispatch(
											StackActions.reset({
												index: 0,
												actions: [
													NavigationActions.navigate({
														routeName: 'StayTunedScreen'
													})
												]
											})
										);
										// navigation.navigate('StayTunedScreen');
									});
								}
							});
						}}
					>
						<Text style={styles.submissionBtn}>Continue</Text>
					</TouchableBtn>
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
