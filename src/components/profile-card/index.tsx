//
//	TODO: Add possible field values for other fields
//  Add update login,
// 		edit form receives a {}
// 			add store function to be called on `update information`
//
//

import * as React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import Text, { Value } from '../text/index';
import GlobalStyles from '../../styles/global';
import { calculateAge, humanizeCurrency } from '../../utils/index';
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

const defaultPrimaryPhoto = require('../../assets/images/placeholder.png');

export interface IProfileProps {
	userProfile: UserProfile;
	isSelfProfile: boolean;
	isAccountPaid: boolean;
	hideSelfDescription: boolean;
	setUserProfileFavourite: (userProfile: UserProfile, setFavourite: boolean) => void;
	onPhotoPress?: () => any;
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

	render() {
		const {
			userProfile,
			hideSelfDescription,
			isSelfProfile,
			isAccountPaid,
			onPhotoPress
		} = this.props;
		if (isEmpty(userProfile)) return null;
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
		const heartIcon = userProfile.isFavourite ? 'md-heart' : 'md-heart-empty';
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

		return (
			<View style={styles.profileCard}>
				<View style={styles.profileImageContainer}>
					{primaryUserProfilePhoto && (
						<ProfileImageCarousel
							onPress={() => onPhotoPress && onPhotoPress()}
							userProfile={userProfile}
							isSelfProfile={isSelfProfile}
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
				</View>
				<View style={styles.profileSummaryContainer}>
					<View style={[GlobalStyles.row, GlobalStyles.expand]}>
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
						<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
							<Ionicons
								style={styles.profileActionIcon}
								name="md-star-outline"
								size={24}
								color={Colors.offWhite}
							/>
							<Value>Premium Profile</Value>
						</View>
						{/*<Text style={styles.premiumProfileText}>Premium Profile</Text>*/}
						<View style={GlobalStyles.expand} />
						{isSelfProfile && (
							<TouchableBtn onPress={this.openProfileImageGallery}>
								<Ionicons name="md-camera" size={24} color={Colors.black} />
							</TouchableBtn>
						)}
					</View>
					<View>
						<Text style={[GlobalStyles.large, GlobalStyles.bold]}>
							{userProfileName || 'unknown name'} - U{userProfile.id}
						</Text>
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
								{humanizeCurrency(profession.annualIncome || 0, '₹')}
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
		padding: 10,
		paddingTop: 15,
		paddingBottom: 15
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
	}
});
