import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import * as Signup from './SignupNavigator';
import Auth from '../screens/Auth';

export default createAppContainer(
	createSwitchNavigator(
		{
			// You could add another route here for authentication.
			// Read more at https://reactnavigation.org/docs/en/auth-flow.html
			Auth: Auth,
			Register: Signup.SignUpStack,
			Main: MainTabNavigator
		},
		{
			initialRouteName: 'Auth'
		}
	)
);
