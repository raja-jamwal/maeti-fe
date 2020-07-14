import { createStackNavigator } from 'react-navigation-stack';
import { defaultNavigationOptions } from './common';
import { RegisterForm } from '../components/register-form';
import { UploadPhoto } from '../components/upload-photo/index';

export const SignUpStack = createStackNavigator(
	{
		FormScreen: RegisterForm,
		UploadPhotoScreen: UploadPhoto
	},
	{ defaultNavigationOptions }
);
