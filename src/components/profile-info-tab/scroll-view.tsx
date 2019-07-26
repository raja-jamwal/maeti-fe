import * as React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableNativeFeedback } from 'react-native';
import Text from '../text/index';
import ConnectedProfile from '../profile-card/connected-profile';
import GlobalStyles from '../../styles/global';
import ProfileTable from '../collapsible-table/profile-table';
import EducationTable from '../collapsible-table/education-table';
import ProfessionTable from '../collapsible-table/profession-table';
import HoroscopeTable from '../collapsible-table/horoscope-table';
import InvestmentTable from '../collapsible-table/investment-table';
import LifestyleTable from '../collapsible-table/lifestyle-table';
import ContactTable from '../collapsible-table/contact-table';
import ReferenceTable from '../collapsible-table/reference-table';
import FamilyTable from '../collapsible-table/family-table';
import Colors from '../../constants/Colors';
import VerificationTable from '../collapsible-table/verification-table';
import PreferenceTable from '../collapsible-table/preference-table';

interface IProfileInfoTabProps {
	userProfileId: number;
}

interface IProfileInfoTabState {
	route: string;
}

export default class ProfileInfoTab extends React.Component<
	IProfileInfoTabProps,
	IProfileInfoTabState
> {
	constructor(props: IProfileInfoTabProps) {
		super(props);
		this.state = {
			route: 'personal'
		};
		this._handleRouteChange = this._handleRouteChange.bind(this);
		this._renderScene = this._renderScene.bind(this);
	}

	_handleRouteChange(route: string) {
		this.setState({ route });
	}

	_renderScene() {
		const { route } = this.state;
		const { userProfileId } = this.props;
		let tab = null;
		switch (route) {
			case 'personal':
				tab = (
					<View style={styles.scene}>
						<VerificationTable userProfileId={userProfileId} />
						<ProfileTable userProfileId={userProfileId} />
						<EducationTable userProfileId={userProfileId} />
						<ProfessionTable userProfileId={userProfileId} />
						<HoroscopeTable userProfileId={userProfileId} />
						<InvestmentTable userProfileId={userProfileId} />
						<LifestyleTable userProfileId={userProfileId} />
						<ContactTable userProfileId={userProfileId} />
						<ReferenceTable userProfileId={userProfileId} />
					</View>
				);
				break;
			case 'family':
				tab = (
					<View>
						<FamilyTable userProfileId={userProfileId} />
					</View>
				);
				break;
			case 'expectations':
				tab = (
					<View>
						<PreferenceTable userProfileId={userProfileId} />
					</View>
				);
				break;
		}

		return <View>{tab}</View>;
	}

	activeRoute(current: string) {
		const { route } = this.state;
		if (route === current) {
			return styles.focusedTab;
		}
		return {};
	}

	render() {
		const { userProfileId } = this.props;
		if (!userProfileId) return null;
		return (
			<ScrollView
				stickyHeaderIndices={[1]}
				style={[GlobalStyles.expand, styles.scrollViewContainer]}
			>
				<View>
					<ConnectedProfile userProfileId={userProfileId} hideSelfDescription={true} />
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
				</View>
				<View style={styles.tabBar}>
					<View style={[GlobalStyles.row, GlobalStyles.expand, GlobalStyles.alignCenter]}>
						<TouchableNativeFeedback
							onPress={() => this._handleRouteChange('personal')}
						>
							<View style={GlobalStyles.expand}>
								<Text style={[styles.tabLink, this.activeRoute('personal')]}>
									Personal
								</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback onPress={() => this._handleRouteChange('family')}>
							<View style={GlobalStyles.expand}>
								<Text style={[styles.tabLink, this.activeRoute('family')]}>
									Family
								</Text>
							</View>
						</TouchableNativeFeedback>
						<TouchableNativeFeedback
							onPress={() => this._handleRouteChange('expectations')}
						>
							<View style={GlobalStyles.expand}>
								<Text style={[styles.tabLink, this.activeRoute('expectations')]}>
									Expectations
								</Text>
							</View>
						</TouchableNativeFeedback>
					</View>
				</View>
				<View>{this._renderScene()}</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	scrollViewContainer: {
		flex: 1
	},
	scene: {
		flex: 1
	},
	tabBar: {
		backgroundColor: 'white'
	},
	tabLink: {
		color: Colors.offWhite,
		padding: 15,
		textAlign: 'center'
	},
	focusedTab: {
		borderBottomWidth: 2,
		borderBottomColor: Colors.orange
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