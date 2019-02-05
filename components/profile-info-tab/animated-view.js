// Depreciated implementation TODO: remove
import * as React from 'react';
import { View, StyleSheet, Dimensions, ImageBackground, Animated, Image } from 'react-native';
import { Constants } from 'expo';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Text from '../text'; // Version can be specified in package.json
import ContactsList from './ContactsList';
import ConnectedProfile from '../profile-card/connected-profile';
import GlobalStyles from '../../styles/global';
import ProfileTable from '../collapsible-table/profile-table';
import EducationTable from '../collapsible-table/education-table';
import ProfessionTable from '../collapsible-table/profesional-table';
import HoroscopeTable from '../collapsible-table/horoscope-table';
import InvestmentTable from '../collapsible-table/investment-table';
import LifestyleTable from '../collapsible-table/lifestyle-table';
import ContactTable from '../collapsible-table/contact-table';
import ReferenceTable from '../collapsible-table/reference-table';
import FamilyTable from '../collapsible-table/family-table';
import ExpectationsTable from '../collapsible-table/expectations-table';

const initialLayout = {
	height: 0,
	width: Dimensions.get('window').width
};

const HEADER_HEIGHT = 585;
const COLLAPSED_HEIGHT = 52 + Constants.statusBarHeight;
const SCROLLABLE_HEIGHT = HEADER_HEIGHT - COLLAPSED_HEIGHT;

/*const ContactsList = () => (
	<View style={styles.container}>
		<Text>Hello</Text>
	</View>
);*/

export default class ProfileInfoTab extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			index: 0,
			routes: [
				{ key: 'personal', title: 'Personal' },
				{ key: 'family', title: 'Family' },
				{ key: 'expectations', title: 'Expectations' }
			],
			scroll: new Animated.Value(0),
			scrolls: {
				personal: new Animated.Value(0),
				family: new Animated.Value(0),
				expectations: new Animated.Value(0)
			}
		};
	}

	_handleIndexChange = index => {
		this.setState({ index });
	};

	_renderHeader = props => {
		// based on index do header translation
		/*let translateY = null;
		switch (this.state.index) {
			case 0:
				translateY = this.state.scrolls.personal.interpolate({
					inputRange: [0, SCROLLABLE_HEIGHT],
					outputRange: [0, -SCROLLABLE_HEIGHT],
					extrapolate: 'clamp'
				});
				break;
			case 1:
				translateY = this.state.scrolls.family.interpolate({
					inputRange: [0, SCROLLABLE_HEIGHT],
					outputRange: [0, -SCROLLABLE_HEIGHT],
					extrapolate: 'clamp'
				});
				break;
			case 2:
				translateY = this.state.scrolls.expectations.interpolate({
					inputRange: [0, SCROLLABLE_HEIGHT],
					outputRange: [0, -SCROLLABLE_HEIGHT],
					extrapolate: 'clamp'
				});
				break;
		}*/

		const translateY = this.state.scroll.interpolate({
			inputRange: [0, SCROLLABLE_HEIGHT],
			outputRange: [0, -SCROLLABLE_HEIGHT],
			extrapolate: 'clamp'
		});

		return (
			<Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
				{/*<ImageBackground source={{ uri: 'https://picsum.photos/900' }} style={styles.cover}>
					<View style={styles.overlay} />
					<View>
						<ConnectedProfile />
						<TabBar {...props} style={styles.tabbar} />
					</View>
					<TabBar {...props} style={styles.tabbar} />
				</ImageBackground>*/}
				<View>
					<ConnectedProfile hideSelfDescription={true} />
					<View style={GlobalStyles.row}>
						<View style={[GlobalStyles.expand, GlobalStyles.alignCenter]}>
							<Image
								style={styles.icon}
								source={require('../../assets/images/icons/response_rate.png')}
							/>
							<Text style={[styles.iconLabel, GlobalStyles.bold]}>73%</Text>
							<Text style={styles.iconLabel}>Response Rate</Text>
						</View>
						<View style={[GlobalStyles.expand, GlobalStyles.alignCenter]}>
							<Image
								style={styles.icon}
								source={require('../../assets/images/icons/response_time.png')}
							/>
							<Text style={[styles.iconLabel, GlobalStyles.bold]}>1 Day(s)</Text>
							<Text style={styles.iconLabel}>Response Time</Text>
						</View>
						<View style={[GlobalStyles.expand, GlobalStyles.alignCenter]}>
							<Image
								style={styles.icon}
								source={require('../../assets/images/icons/last_login.png')}
							/>
							<Text style={[styles.iconLabel, GlobalStyles.bold]}>26/01/2019</Text>
							<Text style={styles.iconLabel}>Last Login</Text>
						</View>
					</View>
					<TabBar {...props} labelStyle={styles.labelStyle} style={styles.tabbar} />
				</View>
			</Animated.View>
		);
	};

	_renderScene = props => {
		//console.warn(p);
		const {
			route: { key }
		} = props;

		let tab = null;

		switch (key) {
			case 'personal':
				tab = (
					<View>
						<ProfileTable />
						<EducationTable />
						<ProfessionTable />
						<HoroscopeTable />
						<InvestmentTable />
						<LifestyleTable />
						<ContactTable />
						<ReferenceTable />
					</View>
				);
				break;
			case 'family':
				tab = (
					<View>
						<FamilyTable />
					</View>
				);
				break;
			case 'expectations':
				tab = (
					<View>
						<ExpectationsTable />
					</View>
				);
				break;
		}

		return (
			<Animated.ScrollView
				scrollEventThrottle={1}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: this.state.scroll } } }],
					{ useNativeDriver: true }
				)}
				contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
			>
				{tab}
			</Animated.ScrollView>
		);
	};

	render() {
		return (
			<TabView
				style={styles.container}
				navigationState={this.state}
				renderScene={SceneMap({
					personal: this._renderScene,
					family: this._renderScene,
					expectations: this._renderScene
				})}
				renderTabBar={this._renderHeader}
				onIndexChange={this._handleIndexChange}
				initialLayout={initialLayout}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, .32)'
	},
	cover: {
		height: HEADER_HEIGHT
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 1
	},
	labelStyle: {
		color: 'black'
	},
	tabbarContainer: {
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: 'white'
	},
	tabbar: {
		backgroundColor: 'white',
		elevation: 0
	},
	icon: {
		width: 80,
		height: 80,
		resizeMode: 'contain'
	},
	iconLabel: {
		textAlign: 'center'
	}
});
