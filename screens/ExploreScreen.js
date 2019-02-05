import React from 'react';
import {
	Image,
	ScrollView,
	StyleSheet,
	TextInput,
	View,
	TouchableNativeFeedback
} from 'react-native';
import Text from '../components/text';
import Colors from '../constants/Colors';
import HomeScreen from './HomeScreen';
import GlobalStyles from '../styles/global';
import _ from 'lodash';
import ConnectedProfile from '../components/profile-card/connected-profile';
import { Icon } from 'expo';
import TabbedFilters from '../components/tabbed-filters';

const CustomHeader = props => {
	const navigateToProfile = () => props.navigation.push('ProfileScreen');
	return (
		<View style={[GlobalStyles.row, GlobalStyles.alignCenter, styles.header]}>
			<TouchableNativeFeedback onPress={() => navigateToProfile()}>
				<Image source={require('../assets/images/robot-dev.png')} style={styles.avatar} />
			</TouchableNativeFeedback>
			<TextInput style={[GlobalStyles.expand, styles.searchInput]} />
			<Icon.Ionicons
				style={styles.navBarIcon}
				color={Colors.white}
				name="md-save"
				size={26}
			/>
			<Icon.Ionicons
				style={styles.navBarIcon}
				color={Colors.white}
				name="md-funnel"
				size={26}
			/>
		</View>
	);
};

export default class ExploreScreen extends React.Component {
	static navigationOptions = {
		title: 'Explore',
		header: CustomHeader
	};

	constructor(props) {
		super(props);
		this.openProfileScreen = this.openProfileScreen.bind(this);
	}

	openProfileScreen() {
		const { navigation } = this.props;
		navigation.push('ProfileScreen');
	}

	render() {
		return (
			<ScrollView style={GlobalStyles.expand}>
				<View>
					<Text style={styles.headline}>Choose a type of match</Text>
				</View>
				<TabbedFilters />
				<View>
					<Text style={styles.headline}>Discover</Text>
				</View>
				{_.range(5).map(i => (
					<TouchableNativeFeedback key={i} onPress={this.openProfileScreen}>
						<View style={styles.profileCardContainer}>
							<ConnectedProfile />
						</View>
					</TouchableNativeFeedback>
				))}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	headline: {
		fontSize: 25,
		fontWeight: '500',
		padding: 20
	},
	navBarIcon: {
		paddingRight: 10
	},
	searchInput: {
		backgroundColor: Colors.tintColor,
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10,
		color: 'white'
	},
	avatar: {
		width: 26,
		height: 26,
		borderRadius: 20,
		margin: 10,
		borderWidth: 3,
		// padding: 10,
		borderColor: 'white'
	},
	header: {
		backgroundColor: Colors.primaryDarkColor
	},
	profileCardContainer: {
		elevation: 10,
		marginBottom: 10,
		borderColor: 'black'
	}
});
