import { createStackNavigator } from 'react-navigation-stack';
import { defaultNavigationOptions } from './common';
import { RegisterForm } from '../components/register-form';
import { UploadPhoto } from '../components/upload-photo/index';
import { SmsEmailVerification } from '../components/sms-email-verification';
import { StayTuned } from '../components/stay-tuned/index';

export const SignUpStack = createStackNavigator(
	{
		FormScreen: RegisterForm,
		UploadPhotoScreen: UploadPhoto,
		Verification: SmsEmailVerification,
		UnderReviewScreen: StayTuned
	},
	{ defaultNavigationOptions }
);
