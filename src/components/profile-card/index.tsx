//
//	TODO: Add possible field values for other fields
//  Add update login,
// 		edit form receives a {}
// 			add store function to be called on `update information`
//
//

import * as React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableHighlight, Platform } from 'react-native';
import Text, { Value } from '../text/index';
import GlobalStyles from '../../styles/global';
import { calculateAge, humanizeCurrency, MILLIS_IN_A_DAY } from '../../utils/index';
import { isEmpty, head, get } from 'lodash';
import { UserProfile } from '../../store/reducers/account-defination';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { find } from 'lodash';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import Layout from 'src/constants/Layout.js';
import ProfileImageCarousel from '../profile-image-carousel/profile-image-carousel';
import { ProfileTableHeightOptions } from '../collapsible-table/profile-table';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { simplePrompt } from '../alert/index';
import { encodeProfileId } from '../../utils/profile-id-encoder';
import { ProfessionTableIncomeOptions } from '../collapsible-table/profession-table';

const defaultPrimaryPhoto = require('../../assets/images/placeholder.png');

export interface IProfileProps {
	userProfile: UserProfile;
	isSelfProfile: boolean;
	isAccountPaid: boolean;
	hideSelfDescription: boolean;
	setUserProfileFavourite: (userProfile: UserProfile, setFavourite: boolean) => void;
	markProfileAsBlocked: (userProfile: UserProfile, shouldReport: boolean) => void;
	onPhotoPress?: () => any;
	showCarousel?: boolean;
	isProfileBlocked?: boolean;
	isProfileDeleted?: boolean;
}

type IProfileCardProps = NavigationInjectedProps & IProfileProps;

class ProfileCard extends React.PureComponent<IProfileCardProps> {
	constructor(props: IProfileCardProps) {
		super(props);
		this.openProfileImageGallery = this.openProfileImageGallery.bind(this);
		this.setUserProfileFavourite = this.setUserProfileFavourite.bind(this);
	}

	premiumProfileWidth() {
		const screenWidth = Dimensions.get('window').width;
		return {
			width: screenWidth * 0.4
		};
	}

	openProfileImageGallery() {
		const { userProfile, navigation } = this.props;
		const userProfileId = userProfile.id;
		navigation.push('ProfileImageGalleryScreen', { userProfileId });
	}

	setUserProfileFavourite() {
		const { userProfile, setUserProfileFavourite } = this.props;
		setUserProfileFavourite(userProfile, !userProfile.isFavourite);
	}

	getHeightInFt(height: number): string {
		if (!height) return '0';
		const heightOption = find(ProfileTableHeightOptions, { value: height }) as any;
		if (!heightOption) return '0';
		return heightOption.label;
	}

	getAnnualIncome(income: number): string {
		if (!income) return '0';
		const incomeOption = find(ProfessionTableIncomeOptions, { value: income }) as any;
		if (!incomeOption) return humanizeCurrency(income || 0, '₹');
		return incomeOption.label;
	}

	reportProfile() {
		const { markProfileAsBlocked, userProfile, navigation } = this.props;
		simplePrompt(
			'Report and block user',
			'Report this user to Maeti and block the user from accessing your profile?',
			() => {
				markProfileAsBlocked(userProfile, true);
				navigation.goBack();
			}
		);
	}

	blockProfile() {
		const { markProfileAsBlocked, userProfile, navigation } = this.props;
		simplePrompt('Block this user', 'Block this user from accessing your profile?', () => {
			markProfileAsBlocked(userProfile, false);
			navigation.goBack();
		});
	}

	userMagazineId(profileId: number) {
		return encodeProfileId(profileId);
	}

	render() {
		const {
			userProfile,
			hideSelfDescription,
			isSelfProfile,
			isAccountPaid,
			onPhotoPress,
			showCarousel,
			isProfileBlocked,
			isProfileDeleted
		} = this.props;
		if (isEmpty(userProfile)) return null;
		if (isProfileBlocked) return null;
		if (isProfileDeleted) return null;
		const { education, profession, family } = { ...userProfile };
		const userProfileName = isAccountPaid || isSelfProfile ? userProfile.fullName : 'xxxxxxx';
		const professionLocation = ['workCity', 'workState', 'workCountry']
			.map(e => get(profession, e))
			.map(o => o && o.name)
			.filter(o => !!o)
			.join(', ');
		const familyLocation = ['familyCity', 'familyState', 'familyCountry']
			.map(e => get(family, e))
			.map(o => o && o.name)
			.filter(o => !!o)
			.join(', ');
		const heartIcon = userProfile.isFavourite ? 'heart' : 'heart-outline';
		const heartColor = userProfile.isFavourite ? Colors.pink : Colors.black;
		const primaryUserProfilePhoto = (() => {
			if (isEmpty(userProfile.photo)) {
				return null;
			}
			let approvedPhotos = [];
			// if it's a self profile we can show
			// any photo as primary photo
			if (isSelfProfile) {
				approvedPhotos = userProfile.photo;
			} else {
				approvedPhotos = userProfile.photo.filter(p => !!p.isApproved);
			}

			if (!isEmpty(approvedPhotos)) {
				return head(approvedPhotos);
			}

			return null;
		})();

		if (!isSelfProfile) {
			// profile without photo not discoverable
			if (!primaryUserProfilePhoto) {
				return null;
			}
			// profile without name not discoverable
			if (!userProfile.fullName) {
				return null;
			}
		}

		// if the last login is within last 2 days, then we consider
		// this as recently active
		const isRecentlyActive =
			new Date().getTime() - (userProfile.lastLogin || 0) < MILLIS_IN_A_DAY * 2;

		return (
			<View style={styles.profileCard}>
				<View style={styles.profileImageContainer}>
					{primaryUserProfilePhoto && (
						<ProfileImageCarousel
							onPress={() => onPhotoPress && onPhotoPress()}
							userProfile={userProfile}
							isSelfProfile={isSelfProfile}
							showCarousel={showCarousel}
						/>
					)}
					{!primaryUserProfilePhoto && (
						<TouchableHighlight onPress={() => onPhotoPress && onPhotoPress()}>
							<Image
								source={defaultPrimaryPhoto}
								style={[
									styles.profileImage,
									{ width: Layout.window.width, height: Layout.window.height / 2 }
								]}
							/>
						</TouchableHighlight>
					)}
					<View style={styles.kutaContainer}>
						<View
							style={[
								GlobalStyles.column,
								GlobalStyles.alignCenter,
								GlobalStyles.justifyCenter
							]}
						>
							<Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold' }}>
								{userProfile.totalKutasGained}
							</Text>
							<Text style={styles.kutaLabel}>GUUNS</Text>
							<Text style={styles.kutaLabel}>MATCH</Text>
						</View>
					</View>
				</View>
				<View style={styles.profileSummaryContainer}>
					<View style={[GlobalStyles.row, GlobalStyles.expand, GlobalStyles.alignCenter]}>
						{!isSelfProfile && (
							<TouchableBtn onPress={this.setUserProfileFavourite}>
								<Ionicons
									style={styles.profileActionIcon}
									name={heartIcon}
									size={24}
									color={heartColor}
								/>
							</TouchableBtn>
						)}
						{/* <View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
							<Ionicons
								style={styles.profileActionIcon}
								name="md-star-outline"
								size={24}
								color={Colors.offWhite}
							/>
							<Value>Premium Profile</Value>
						</View> */}
						{/*<Text style={styles.premiumProfileText}>Premium Profile</Text>*/}
						<Text style={[GlobalStyles.large, GlobalStyles.bold]}>
							{userProfileName || 'unknown name'} - U
							{this.userMagazineId(userProfile.id)}
						</Text>
						<View style={GlobalStyles.expand} />
						{/* {!isSelfProfile && showCarousel && (
							<TouchableOpacity onPress={() => this.reportProfile()}>
								<Text style={styles.report}>REPORT</Text>
							</TouchableOpacity>
						)} */}
						{!isSelfProfile && isRecentlyActive && (
							<View
								style={[
									GlobalStyles.row,
									GlobalStyles.justifyCenter,
									GlobalStyles.alignCenter
								]}
							>
								<Value>Recently Active</Value>
								<Text
									style={{
										color: 'green',
										fontSize: 8,
										paddingLeft: 4,
										paddingRight: 4
									}}
								>
									⬤
								</Text>
							</View>
						)}
						{!isSelfProfile && showCarousel && (
							<TouchableOpacity onPress={() => this.blockProfile()}>
								<Text style={styles.report}>BLOCK</Text>
							</TouchableOpacity>
						)}
						{isSelfProfile && (
							<TouchableBtn onPress={this.openProfileImageGallery}>
								<Ionicons name="md-camera" size={24} color={Colors.black} />
							</TouchableBtn>
						)}
					</View>

					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						{!!userProfile.dob && (
							<Value>Age {calculateAge(userProfile.dob || 0)}</Value>
						)}
						{!!userProfile.height && (
							<Value>{this.getHeightInFt(userProfile.height || 0)} Ft</Value>
						)}
						{/*<Value>{horoscope.caste || 'unknown caste'}</Value>*/}
						{/*<Value>, {horoscope.subCaste || 'unknown sub caste'}</Value>*/}
					</View>
					{!!education.education && (
						<View style={GlobalStyles.row}>
							<Value>{education.education || 'unknown education'}</Value>
						</View>
					)}
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						{!!profession.designation && (
							<Value>{profession.designation || 'unknown designation'}</Value>
						)}
						{!!profession.company && (
							<Value>@ {profession.company || 'unknown company'}</Value>
						)}
						{!!profession.annualIncome && (
							<Value>
								{this.getAnnualIncome(profession.annualIncome)}
								/Year
							</Value>
						)}
					</View>
					{!!professionLocation && (
						<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
							<Value style={GlobalStyles.bold}>Work</Value>
							<Value>- {professionLocation || 'Work location not available'}</Value>
						</View>
					)}
					{!!familyLocation && (
						<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
							<Value style={GlobalStyles.bold}>Family</Value>
							<Value>- {familyLocation || 'Family location not available'}</Value>
						</View>
					)}
					{userProfile.describeMyself && !hideSelfDescription && (
						<View style={[GlobalStyles.row, styles.describeSelfContainer]}>
							{userProfile.describeMyself.map(description => (
								<Value style={styles.selfDescriptionChip} key={description.id}>
									#{description.value}
								</Value>
							))}
						</View>
					)}
				</View>
			</View>
		);
	}
}

export default withNavigation(ProfileCard);

const styles = StyleSheet.create({
	profileCard: {
		backgroundColor: 'white'
	},
	profileImage: {
		width: 100,
		height: 200,
		resizeMode: 'cover'
	},
	profileSummaryContainer: {
		padding: 8,
		paddingTop: 8,
		paddingBottom: 16
	},
	kutaContainer: {
		position: 'absolute',
		bottom: 20,
		right: 0,
		padding: 8,
		backgroundColor: Colors.pink,
		borderTopLeftRadius: 10,
		borderBottomLeftRadius: 10,
		...Platform.select({
			ios: {
				shadowOpacity: 0.1,
				shadowRadius: 5,
				shadowOffset: {
					height: 0,
					width: 0
				}
			},
			android: {
				elevation: 1
			}
		})
	},
	kutaLabel: {
		fontSize: 8,
		textTransform: 'uppercase',
		color: Colors.white
	},
	describeSelfContainer: {
		flexWrap: 'wrap'
	},
	selfDescriptionChip: {
		// backgroundColor: '#FAD291',
		// padding: 5,
		marginTop: 5,
		// color: Colors.black,
		marginRight: 8
		// borderRadius: 5
	},
	profileImageContainer: {
		position: 'relative'
	},
	likeContainer: {
		position: 'absolute',
		top: 0,
		right: 0,
		margin: 15,
		zIndex: 1
	},
	profileActionIcon: {
		paddingRight: 10
	},
	premiumProfile: {
		position: 'absolute',
		bottom: 40,
		flexDirection: 'row',
		backgroundColor: Colors.pink,
		borderTopRightRadius: 20,
		borderBottomRightRadius: 20,
		padding: 10
	},
	premiumProfileText: {
		color: 'white',
		marginLeft: 10,
		backgroundColor: Colors.pink
	},
	report: {
		backgroundColor: Colors.borderColor,
		padding: 4,
		paddingLeft: 8,
		paddingRight: 8,
		marginLeft: 4,
		fontSize: 12,
		color: Colors.black
	}
});
