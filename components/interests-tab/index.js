import * as React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableNativeFeedback } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Colors from '../../constants/Colors';
import _ from 'lodash';
import ConnectedProfile from '../profile-card/connected-profile';
import { withNavigation } from 'react-navigation';

const ProfileListComponent = props => {
	const openProfileScreen = () => {
		const { navigation } = props;
		// navigation.push('ProfileScreen');
	};

	return (
		<ScrollView>
			{_.range(5).map(i => {
				return (
					<TouchableNativeFeedback key={i} onPress={openProfileScreen}>
						<View style={styles.profileCardContainer}>
							<ConnectedProfile accountId="c0bb90b3-d4ac-4007-b48c-3a70db934381" />
						</View>
					</TouchableNativeFeedback>
				);
			})}
		</ScrollView>
	);
};

const ProfileList = withNavigation(ProfileListComponent);

export default class InterestsTab extends React.Component {
	state = {
		index: 0,
		routes: [
			{ key: 'incoming', title: 'Incoming' },
			{ key: 'accepted', title: 'Accepted' },
			{ key: 'sent', title: 'Sent' }
		]
	};

	_renderHeader = props => {
		return (
			<View>
				<TabBar style={styles.tabbar} {...props} />
			</View>
		);
	};

	render() {
		return (
			<TabView
				navigationState={this.state}
				renderScene={SceneMap({
					incoming: ProfileList,
					accepted: ProfileList,
					sent: ProfileList
				})}
				renderTabBar={this._renderHeader}
				onIndexChange={index => this.setState({ index })}
				initialLayout={{ width: Dimensions.get('window').width, height: 0 }}
			/>
		);
	}
}

const styles = StyleSheet.create({
	scene: {
		flex: 1
	},
	tabbar: {
		backgroundColor: Colors.primaryDarkColor
	},
	profileCardContainer: {
		elevation: 10,
		marginBottom: 10,
		borderColor: 'black'
	}
});
