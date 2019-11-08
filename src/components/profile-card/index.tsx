//
//	TODO: Add possible field values for other fields
//  Add update login,
// 		edit form receives a {}
// 			add store function to be called on `update information`
//
//

import * as React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableNativeFeedback } from 'react-native';
import Text, { Value } from '../text/index';
import GlobalStyles from '../../styles/global';
import { calculateAge, humanizeCurrency } from '../../utils/index';
import Divider from '../divider/index';
import { isEmpty, head, get } from 'lodash';
import { PhotosEntity, UserProfile } from '../../store/reducers/account-defination';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import Layout from 'src/constants/Layout.js';
import Carousel from 'react-native-snap-carousel';
import ProfileImageCarousel from '../profile-image-carousel/profile-image-carousel';

const defaultPrimaryPhoto = require('../../assets/images/placeholder.png');

export interface IProfileProps {
	userProfile: UserProfile;
	isSelfProfile: boolean;
	hideSelfDescription: boolean;
	setUserProfileFavourite: (userProfile: UserProfile, setFavourite: boolean) => void;
}

type IProfileCardProps = NavigationInjectedProps & IProfileProps;

class ProfileCard extends React.PureComponent<IProfileCardProps> {
	constructor(props: IProfileCardProps) {
		super(props);
		this.openProfileImageGallery = this.openProfileImageGallery.bind(this);
		this.setUserProfileFavourite = this.setUserProfileFavourite.bind(this);
	}

	fullWidth() {
		const screenWidth = Dimensions.get('window').width;
		return {
			width: screenWidth
		};
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

	render() {
		const { userProfile, hideSelfDescription, isSelfProfile } = this.props;
		if (isEmpty(userProfile)) return null;
		const { horoscope, education, profession, family } = { ...userProfile };
		const professionLocation = ['workCity', 'workState', 'workCountry']
			.map(e => get(profession, e))
			.map(o => o && o.name)
			.filter(o => !!o)
			.join(', ');
		const heartIcon = userProfile.isFavourite ? 'md-heart' : 'md-heart-empty';
		const primaryUserProfilePhoto = !isEmpty(userProfile.photo) && head(userProfile.photo).url;
		return (
			<View style={styles.profileCard}>
				<View style={styles.profileImageContainer}>
					<View style={styles.likeContainer}>
						{!isSelfProfile && (
							<TouchableNativeFeedback onPress={this.setUserProfileFavourite}>
								<Ionicons
									name={heartIcon}
									size={30}
									color={Colors.primaryDarkColor}
								/>
							</TouchableNativeFeedback>
						)}
						{isSelfProfile && (
							<TouchableNativeFeedback onPress={this.openProfileImageGallery}>
								<Ionicons
									name="md-create"
									size={30}
									color={Colors.primaryDarkColor}
								/>
							</TouchableNativeFeedback>
						)}
					</View>
					{primaryUserProfilePhoto && <ProfileImageCarousel userProfile={userProfile} />}
					{!primaryUserProfilePhoto && (
						<Image
							source={defaultPrimaryPhoto}
							style={[styles.profileImage, this.fullWidth()]}
						/>
					)}

					<View style={[styles.premiumProfile, this.premiumProfileWidth()]}>
						<Ionicons name="md-star-outline" size={20} color="white" />
						<Text style={styles.premiumProfileText}>Premium Profile</Text>
					</View>
				</View>
				<View style={styles.profileSummaryContainer}>
					<View>
						<Text style={[GlobalStyles.large, GlobalStyles.bold]}>
							{userProfile.fullName || 'unknown name'} - U{userProfile.id}
						</Text>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						{!!userProfile.dob && (
							<Value>Age {calculateAge(userProfile.dob || 0)}</Value>
						)}
						{!!userProfile.height && <Value>{userProfile.height || 0} Ft</Value>}
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
							<Value style={GlobalStyles.bold}>
								{profession.designation || 'unknown designation'}
							</Value>
						)}
						{!!profession.company && (
							<Value>@ {profession.company || 'unknown company'}</Value>
						)}
						{!!profession.annualIncome && (
							<Value style={GlobalStyles.bold}>
								{humanizeCurrency(profession.annualIncome || 0, '₹')}
								/Year
							</Value>
						)}
					</View>
					{!!family.familyLocation && (
						<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
							<Value style={GlobalStyles.bold}>Home</Value>
							<Value>- {family.familyLocation || 'unknown location'}</Value>
						</View>
					)}
					{!!professionLocation && (
						<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
							<Value style={GlobalStyles.bold}>Work</Value>
							<Value>- {professionLocation || 'Work location not available'}</Value>
						</View>
					)}
					{userProfile.describeMyself && !hideSelfDescription && (
						<View style={[GlobalStyles.row, styles.describeSelfContainer]}>
							{userProfile.describeMyself.map(description => (
								<Text style={styles.selfDescriptionChip} key={description.id}>
									{description.value}
								</Text>
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
		paddingBottom: 15,
	},
	describeSelfContainer: {
		flexWrap: 'wrap'
	},
	selfDescriptionChip: {
		backgroundColor: '#FAD291',
		padding: 5,
		marginTop: 5,
		marginRight: 8,
		borderRadius: 5
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
		marginLeft: 10
	}
});
