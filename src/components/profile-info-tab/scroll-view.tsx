import * as React from 'react';
import { View, StyleSheet, Image, ScrollView, TouchableNativeFeedback } from 'react-native';
import Text, { Value } from '../text/index';
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
import { Throbber } from '../throbber/throbber';
import { getLogger } from '../../utils/logger';
import ProfileActivity from '../profile-card/profile-activity';
import ConnectedPurchaseButton from 'src/components/purchase-button/purchase-button';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { getCeStatus } from '../../utils';
import { isEmpty } from 'lodash';

interface IProfileInfoTabProps {
	userProfileId: number;
	selfProfileId: number;
	getViewedMyContact: (userProfileId: number) => any;
	saveViewedMyContact: (userProfileId: number) => any;
	isInterestAccepted: (fromUserId: number, toUserId: number) => any;
}

interface IProfileInfoTabState {
	route: string;
	loadingViewedMyContact: boolean;
	isViewedMyContact: boolean;
	isInterestAccepted: boolean;
	isCeMode: boolean;
}

export default class ProfileInfoTab extends React.Component<
	IProfileInfoTabProps,
	IProfileInfoTabState
> {
	logger = getLogger(ProfileInfoTab);

	constructor(props: IProfileInfoTabProps) {
		super(props);
		this.state = {
			route: 'personal',
			loadingViewedMyContact: true,
			isViewedMyContact: false,
			isInterestAccepted: false,
			isCeMode: false
		};
		this._handleRouteChange = this._handleRouteChange.bind(this);
		this._renderScene = this._renderScene.bind(this);
	}

	async componentDidMount() {
		const { userProfileId, selfProfileId, getViewedMyContact, isInterestAccepted } = this.props;
		if (!!userProfileId && !!selfProfileId && userProfileId === selfProfileId) {
			return this.setState({
				loadingViewedMyContact: false,
				isViewedMyContact: true
			});
		}

		/*
			This will never fail, resolves in all cases
		 */
		const isAccepted = await isInterestAccepted(selfProfileId, userProfileId);
		const isContactViewed = await getViewedMyContact(userProfileId);
		const isCeMode = !isEmpty(await getCeStatus());
		this.setState({
			loadingViewedMyContact: false,
			isViewedMyContact: isContactViewed,
			isInterestAccepted: isAccepted,
			isCeMode
		});
	}

	_handleRouteChange(route: string) {
		this.setState({ route });
	}

	async markContactAsViewed() {
		const { userProfileId, saveViewedMyContact } = this.props;
		try {
			this.setState({
				loadingViewedMyContact: true
			});
			await saveViewedMyContact(userProfileId);
			this.setState({
				loadingViewedMyContact: false,
				isViewedMyContact: true
			});
		} catch (err) {
			this.setState({
				loadingViewedMyContact: false,
				isViewedMyContact: false
			});
		}
	}

	markContactAsViewedBtn() {
		if (this.state.isInterestAccepted === true) {
			return (
				<TouchableBtn
					onPress={() => {
						this.markContactAsViewed();
					}}
				>
					<View style={styles.contactActionBtn}>
						<Text style={styles.btnLabel}>View Contact</Text>
					</View>
				</TouchableBtn>
			);
		} else {
			return (
				<View>
					<Text>Your interest must be accepted to view contact</Text>
				</View>
			);
		}
	}

	maybeRenderContactTable(isSelfProfile: boolean) {
		const { loadingViewedMyContact } = this.state;
		const { userProfileId } = this.props;

		if (loadingViewedMyContact) {
			return <Throbber size="small" />;
		}
		return this.state.isViewedMyContact && this.state.isInterestAccepted ? (
			<ContactTable userProfileId={userProfileId} editable={isSelfProfile} />
		) : (
			this.markContactAsViewedBtn()
		);
	}

	_renderScene() {
		const { route, isCeMode } = this.state;
		const { userProfileId, selfProfileId } = this.props;
		const isSelfProfile = userProfileId === selfProfileId;
		const isEditable = isSelfProfile || isCeMode;
		let tab = null;
		switch (route) {
			case 'personal':
				tab = (
					<View style={styles.scene}>
						<VerificationTable userProfileId={userProfileId} editable={isCeMode} />
						<ProfileTable userProfileId={userProfileId} editable={isEditable} />
						<EducationTable userProfileId={userProfileId} editable={isEditable} />
						<ProfessionTable userProfileId={userProfileId} editable={isEditable} />
						<HoroscopeTable userProfileId={userProfileId} editable={isEditable} />
						<InvestmentTable userProfileId={userProfileId} editable={isEditable} />
						<LifestyleTable userProfileId={userProfileId} editable={isEditable} />

						{/* <ConnectedPurchaseButton label="Verify account to see Contact Information">
							{this.maybeRenderContactTable(isSelfProfile)}
						</ConnectedPurchaseButton> */}

						{/* <ConnectedPurchaseButton label="Verify account to see References">
							<ReferenceTable
								userProfileId={userProfileId}
								editable={isSelfProfile}
							/>
						</ConnectedPurchaseButton> */}
					</View>
				);
				break;
			case 'family':
				tab = (
					<View>
						<FamilyTable userProfileId={userProfileId} editable={isSelfProfile} />
					</View>
				);
				break;
			case 'expectations':
				tab = (
					<View>
						<PreferenceTable userProfileId={userProfileId} editable={isSelfProfile} />
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
					<ConnectedProfile
						userProfileId={userProfileId}
						hideSelfDescription={true}
						showCarousel={true}
					/>
					<ProfileActivity userProfileId={userProfileId} />
				</View>
				<View style={styles.tabBar}>
					<View style={[GlobalStyles.row, GlobalStyles.expand, GlobalStyles.alignCenter]}>
						<TouchableBtn
							style={GlobalStyles.expand}
							onPress={() => this._handleRouteChange('personal')}
						>
							<View style={[GlobalStyles.expand, this.activeRoute('personal')]}>
								<Text style={styles.tabLink}>Personal</Text>
							</View>
						</TouchableBtn>
						<TouchableBtn
							style={GlobalStyles.expand}
							onPress={() => this._handleRouteChange('family')}
						>
							<View style={[GlobalStyles.expand, this.activeRoute('family')]}>
								<Text style={styles.tabLink}>Family</Text>
							</View>
						</TouchableBtn>
						<TouchableBtn
							style={GlobalStyles.expand}
							onPress={() => this._handleRouteChange('expectations')}
						>
							<View style={[GlobalStyles.expand, this.activeRoute('expectations')]}>
								<Value style={styles.tabLink}>Expectations</Value>
							</View>
						</TouchableBtn>
					</View>
				</View>
				<View style={styles.sceneContainer}>{this._renderScene()}</View>
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
	sceneContainer: {
		marginTop: 10
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
		borderBottomColor: Colors.primaryDarkColor
	},
	icon: {
		width: 80,
		height: 80,
		resizeMode: 'contain'
	},
	iconLabel: {
		textAlign: 'center'
	},
	contactActionBtn: {
		backgroundColor: Colors.primaryDarkColor,
		paddingTop: 5,
		paddingBottom: 5,
		margin: 10,
		borderRadius: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	btnLabel: {
		color: 'white',
		padding: 2
	}
});
