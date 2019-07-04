import React from 'react';
import { Image, TouchableNativeFeedback, View, StyleSheet, ScrollView } from 'react-native';
import GlobalStyles from '../../styles/global';
import Text from '../text/index';
import Colors from '../../constants/Colors';

const TAB_SECTIONS = [
	{
		name: 'search',
		icon: require('../../assets/images/icons/filter_tab.png'),
		label: 'Search'
	},
	{
		name: 'discover',
		icon: require('../../assets/images/icons/discover_matches.png'),
		label: 'Discover'
	},
	{
		name: 'new_matches',
		icon: require('../../assets/images/icons/new_matches.png'),
		label: 'New Matches'
	},
	{
		name: 'reverse_matches',
		icon: require('../../assets/images/icons/reverse_matches.png'),
		label: 'Reverse Matches'
	},
	{
		name: 'my_matches',
		icon: require('../../assets/images/icons/my_matches.png'),
		label: 'My Matches'
	},
	{
		name: 'mutual_matches',
		icon: require('../../assets/images/icons/my_matches.png'),
		label: 'Mutual Matches'
	},
	{
		name: 'community_matches',
		icon: require('../../assets/images/icons/community_match.png'),
		label: 'Community Matches'
	},
	{
		name: 'location_matches',
		icon: require('../../assets/images/icons/location_matches.png'),
		label: 'Location Matches'
	},
	{
		name: 'added_me_favourites',
		icon: require('../../assets/images/icons/who_added_favoutites.png'),
		label: 'Who Added Me To Favourites'
	},
	{
		name: 'viewed_my_contact',
		icon: require('../../assets/images/icons/who_viewed_my_contact.png'),
		label: 'Who Viewed My Contact'
	},
	{
		name: 'viewed_my_profile',
		icon: require('../../assets/images/icons/who_viewed_my_profile.png'),
		label: 'Who Viewed My Profile'
	}
];

export default class TabbedFilters extends React.Component {
	render() {
		return (
			<ScrollView
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				style={GlobalStyles.row}
			>
				{TAB_SECTIONS.map(tab => {
					return (
						<TouchableNativeFeedback key={tab.name}>
							<View style={styles.tile}>
								<Image style={styles.icon} source={tab.icon} />
								<Text style={styles.label}>{tab.label}</Text>
							</View>
						</TouchableNativeFeedback>
					);
				})}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	tile: {
		flexDirection: 'column',
		alignItems: 'center',
		width: 120
	},
	label: {
		color: Colors.offWhite,
		textAlign: 'center'
	},
	icon: {
		width: 80,
		height: 80,
		resizeMode: 'contain'
	}
});
