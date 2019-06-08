import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import ExploreScreen from '../screens/ExploreScreen';
import Colors from '../constants/Colors';
import MessagesScreen from '../screens/MessagesScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import InterestsScreen from '../screens/InterestsScreen';
import MoreScreen from '../screens/MoreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChatScreen from '../screens/ChatScreen';

const defaultNavigationOptions = {
	headerStyle: {
		backgroundColor: Colors.primaryDarkColor
		// marginTop: Constants.statusBarHeight
	},
	headerTintColor: '#fff',
	headerTitleStyle: {
		fontWeight: 'normal'
	}
};

const ExploreStack = createStackNavigator(
	{
		Explore: ExploreScreen,
		ProfileScreen: ProfileScreen,
		EditProfileScreen: EditProfileScreen
	},
	{
		// initialRouteName: 'ProfileScreen',
		defaultNavigationOptions
	}
);

ExploreStack.navigationOptions = {
	tabBarLabel: 'Explore',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-information-circle${focused ? '' : '-outline'}`
					: 'md-search'
			}
		/>
	)
};

const MessagesStack = createStackNavigator(
	{
		Messages: MessagesScreen,
		ChatScreen: ChatScreen
	},
	{ defaultNavigationOptions }
);

MessagesStack.navigationOptions = {
	tabBarLabel: 'Messages',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-information-circle${focused ? '' : '-outline'}`
					: 'md-chatboxes'
			}
		/>
	)
};

const FavouritesStack = createStackNavigator(
	{
		Favourites: FavouritesScreen,
		ProfileScreen: ProfileScreen
	},
	{ defaultNavigationOptions }
);

FavouritesStack.navigationOptions = {
	tabBarLabel: 'Favourites',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-information-circle${focused ? '' : '-outline'}`
					: `md-heart`
			}
		/>
	)
};

const InterestsStack = createStackNavigator(
	{
		Interests: InterestsScreen,
		ProfileScreen: ProfileScreen
	},
	{ defaultNavigationOptions }
);

InterestsStack.navigationOptions = {
	tabBarLabel: 'Interests',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-information-circle${focused ? '' : '-outline'}`
					: 'md-flash'
			}
		/>
	)
};

const MoreStack = createStackNavigator(
	{
		more: MoreScreen
	},
	{ defaultNavigationOptions }
);

MoreStack.navigationOptions = {
	tabBarLabel: 'More',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon
			focused={focused}
			name={
				Platform.OS === 'ios'
					? `ios-information-circle${focused ? '' : '-outline'}`
					: `md-information${focused ? '-circle' : ''}`
			}
		/>
	)
};

export default createBottomTabNavigator(
	{
		ExploreStack,
		MessagesStack,
		FavouritesStack,
		InterestsStack,
		MoreStack
	},
	{
		initialRouteName: 'ExploreStack',
		tabBarOptions: {
			activeTintColor: Colors.primaryDarkColor
		}
	}
);

export { ExploreStack };
