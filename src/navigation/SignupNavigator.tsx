import { createStackNavigator } from 'react-navigation-stack';
import { defaultNavigationOptions } from './common';
import { RegisterForm } from '../components/register-form';

export const SignUpStack = createStackNavigator(
	{
		FormScreen: RegisterForm
	},
	{ defaultNavigationOptions }
);
