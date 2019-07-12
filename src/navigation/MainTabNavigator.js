import React from 'react';
import { Platform } from 'react-native';
import {
	createStackNavigator,
	createBottomTabNavigator,
	createMaterialTopTabNavigator
} from 'react-navigation';
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
import FilterScreen from '../screens/FilterScreen';

import IncomingTab from '../components/interests-tab/tabs/IncomingTab';
import AcceptedTab from '../components/interests-tab/tabs/AcceptedTab';
import SentTab from '../components/interests-tab/tabs/SentTab';

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
		EditProfileScreen: EditProfileScreen,
		FilterScreen: FilterScreen
	},
	{
		// initialRouteName: 'FilterScreen',
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

MessagesStack.navigationOptions = ({ navigation }) => ({
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
	),
	tabBarVisible: navigation.state.index === 0
});

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

const InterestTabs = createMaterialTopTabNavigator(
	{
		Incoming: IncomingTab,
		Accepted: AcceptedTab,
		Sent: SentTab
	},
	{
		navigationOptions: {
			header: null
		},
		tabBarOptions: {
			style: {
				backgroundColor: Colors.primaryDarkColor
			}
		}
	}
);

const InterestsStack = createStackNavigator(
	{
		Interests: InterestTabs,
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
