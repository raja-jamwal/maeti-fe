import React from 'react';
import { Platform, View, Text, SafeAreaView } from 'react-native';
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
import { BlockedProfileListScreen } from '../screens/BlockedProfileListScreen';

import IncomingTab from '../components/interests-tab/tabs/IncomingTab';
import AcceptedTab from '../components/interests-tab/tabs/AcceptedTab';
import SentTab from '../components/interests-tab/tabs/SentTab';
import ProfileImageGalleryScreen from '../screens/ProfileImageGalleryScreen';
// import TabBarComponent from '../components/tab-bar-component'; // remove the support is added in latest version

import { createStackNavigator } from 'react-navigation-stack';
import {
	createMaterialTopTabNavigator,
	createBottomTabNavigator,
	MaterialTopTabBar
} from 'react-navigation-tabs'; // investigate these import

const defaultNavigationOptions = {
	headerStyle: {
		backgroundColor: 'white',
		...Platform.select({
			ios: {
				height: 100
			},
			android: {
				height: 50
			}
		})
	},
	headerTintColor: Colors.offWhite,
	headerTitleStyle: {
		fontWeight: 'normal',
		fontSize: 16
	},
	labelStyle: {
		fontSize: 8
	},
	cardStyle: { backgroundColor: 'white' }
};

const ExploreStack = createStackNavigator(
	{
		Explore: ExploreScreen,
		ProfileScreen: ProfileScreen,
		ProfileImageGalleryScreen: ProfileImageGalleryScreen,
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
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-search" />
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
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-chatboxes" />,
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
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-heart" />
};

// for ios the tabbars inside safearea, may be for androids
// with notch we should utilize same
const SafeAreaMaterialTopTabBar = ({ ...props }) => (
	<SafeAreaView>
		<MaterialTopTabBar {...props} />
	</SafeAreaView>
);

const InterestTabs = createMaterialTopTabNavigator(
	{
		Incoming: IncomingTab,
		Sent: SentTab,
		Accepted: AcceptedTab
	},
	{
		...Platform.select({
			ios: {
				navigationOptions: {
					header: null
				},
				tabBarComponent: props => <SafeAreaMaterialTopTabBar {...props} />
			},
			android: {
				navigationOptions: {
					header: null
				}
			}
		}),
		tabBarOptions: {
			inactiveTintColor: Colors.offWhite,
			activeTintColor: Colors.primaryDarkColor,
			style: {
				backgroundColor: 'white'
			},
			indicatorStyle: {
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
	tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-flash" />
};

const MoreStack = createStackNavigator(
	{
		more: MoreScreen,
		BlockedProfileListScreen: BlockedProfileListScreen
	},
	{ defaultNavigationOptions }
);

MoreStack.navigationOptions = {
	tabBarLabel: 'More',
	tabBarIcon: ({ focused }) => (
		<TabBarIcon focused={focused} name={`md-information${focused ? '-circle' : ''}`} />
	)
};

const bottomTabNavigatorOptions = {
	initialRouteName: 'ExploreStack',
	tabBarOptions: {
		// color: 'black',
		activeTintColor: Colors.primaryDarkColor
	}
};

// if (Platform.OS === 'android') {
// 	bottomTabNavigatorOptions.tabBarComponent = props => <TabBarComponent {...props} />;
// }

export default createBottomTabNavigator(
	{
		ExploreStack,
		MessagesStack,
		FavouritesStack,
		InterestsStack,
		MoreStack
	},
	bottomTabNavigatorOptions
);

export { ExploreStack };
