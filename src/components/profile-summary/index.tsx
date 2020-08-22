import * as React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { UserProfile } from '../../store/reducers/account-defination';
import GlobalStyle from '../../styles/global';
import { Avatar } from '../avatar';
import { Value } from '../text';
import { isEmpty, head, get } from 'lodash';
import { calculateAge, humanizeCurrency, formatDate, ApiRequest } from '../../utils';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { API } from '../../config/API';
import { Ionicons } from '@expo/vector-icons';

interface IPROPS {
	userProfile: UserProfile;
	currentUserProfileId?: number;
}

export const ProfileSummary = withNavigation(
	({ userProfile, navigation, currentUserProfileId }: IPROPS & NavigationInjectedProps) => {
		console.log('ProfileSummary ', currentUserProfileId);
		if (!userProfile || !currentUserProfileId) return null;
		const userProfileImage =
			(!isEmpty(userProfile.photo) && head(userProfile.photo).url) || undefined;
		const userProfileName = userProfile.fullName || 'unknown name';
		const education = userProfile.education;
		const profession = userProfile.profession;
		const family = userProfile.family;
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

		const openProfile = () => {
			navigation.push('ProfileScreen', {
				userProfileId: userProfile.id,
				profileName: userProfileName
			});
		};

		const callNumber = (phoneNumber: string) => {
			Linking.openURL(`tel:${phoneNumber}`);
		};

		const [paidContact, setPaidContact] = React.useState('');

		React.useEffect(() => {
			ApiRequest(API.PAID_CONTACT.GET, {
				fromUserProfileId: currentUserProfileId,
				toUserProfileId: userProfile.id
			}).then((response: any) => {
				setPaidContact(response.contact || '');
			});
		}, []);
		return (
			<View style={styles.container}>
				<View style={GlobalStyle.row}>
					<TouchableOpacity onPress={openProfile} style={styles.avatarContainer}>
						<Avatar userProfileImage={userProfileImage} />
					</TouchableOpacity>
					<View>
						<Text style={GlobalStyle.bold}>{userProfileName}</Text>
						{/* </View> */}
						<View style={[GlobalStyle.row, GlobalStyle.alignCenter]}>
							{!!userProfile.dob && (
								<Value>Age {calculateAge(userProfile.dob || 0)}</Value>
							)}
						</View>
						{!!education.education && (
							<View style={GlobalStyle.row}>
								<Value>{education.education || 'unknown education'}</Value>
							</View>
						)}
						<View style={[GlobalStyle.row, GlobalStyle.alignCenter]}>
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
							<View style={[GlobalStyle.row, GlobalStyle.alignCenter]}>
								<Value style={GlobalStyle.bold}>Work</Value>
								<Value>
									- {professionLocation || 'Work location not available'}
								</Value>
							</View>
						)}
						{!!familyLocation && (
							<View style={[GlobalStyle.row, GlobalStyle.alignCenter]}>
								<Value style={GlobalStyle.bold}>Family</Value>
								<Value>- {familyLocation || 'Family location not available'}</Value>
							</View>
						)}
						{!!userProfile.lastLogin && (
							<View style={[GlobalStyle.row, GlobalStyle.alignCenter]}>
								<Value style={GlobalStyle.bold}>Last active</Value>
								<Value>- {formatDate(userProfile.lastLogin / 1000)}</Value>
							</View>
						)}
						{!!paidContact && (
							<TouchableOpacity onPress={() => callNumber(paidContact)}>
								<View style={GlobalStyle.row}>
									<Ionicons
										name="md-call"
										size={16}
										style={{ paddingRight: 8 }}
									/>
									<Text>+{paidContact}</Text>
								</View>
							</TouchableOpacity>
						)}
						{!paidContact && (
							<View>
								<Value style={[GlobalStyle.bold]}>
									Make sure you trust the person
								</Value>
								<Value style={[GlobalStyle.bold]}>
									Before sharing your contact
								</Value>
							</View>
						)}
					</View>
				</View>
			</View>
		);
	}
);

const styles = StyleSheet.create({
	container: {
		padding: 12,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
		backgroundColor: '#eee'
	},
	avatarContainer: {
		paddingRight: 12
	}
});
