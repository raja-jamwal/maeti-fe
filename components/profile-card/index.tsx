//
//	TODO: Add possible field values for other fields
//  Add update login,
// 		edit form receives a {}
// 			add store function to be called on `update information`
//
//

import * as React from 'react';
import {
	View,
	// Text,
	Image,
	StyleSheet,
	Dimensions
} from 'react-native';
import Text, { Value } from '../text';
import GlobalStyles from '../../styles/global';
import { calculateAge, humanizeCurrency } from '../../utils';
import Divider from '../divider';
import { isEmpty } from 'lodash';
import { UserProfile } from '../../store/reducers/account-defination';

interface IProfileProps {
	user_profile: UserProfile;
	hideSelfDescription: boolean;
}

class ProfileCard extends React.Component<IProfileProps, any> {
	constructor(props: IProfileProps) {
		super(props);
	}

	fullWidth() {
		const screenWidth = Dimensions.get('window').width;
		// const screenHeight = Dimensions.get('window').height;
		return {
			width: screenWidth
		};
	}

	render() {
		const { user_profile, hideSelfDescription } = this.props;
		if (isEmpty(user_profile)) return null;
		const { horoscope, education, profession, family } = { ...user_profile };
		return (
			<View style={styles.profileCard}>
				<Image
					source={require('../../assets/images/doctor-placeholder.jpg')}
					style={[styles.profileImage, this.fullWidth()]}
				/>
				<View style={styles.profileSummaryContainer}>
					<View>
						<Text style={[GlobalStyles.large, GlobalStyles.bold]}>
							{user_profile.full_name || 'unknown name'}
						</Text>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						<Value>Age {calculateAge(user_profile.dob || 0)}</Value>
						<Divider />
						<Value>{user_profile.height || 0} Ft</Value>
						<Divider />
						<Value>{horoscope.caste || 'unknown caste'}</Value>
						<Value>, {horoscope.sub_caste || 'unknown sub caste'}</Value>
					</View>
					<View style={GlobalStyles.row}>
						<Value>{education.education || 'unknown education'}</Value>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						<Value style={GlobalStyles.bold}>
							{profession.designation || 'unknown designation'}
						</Value>
						<Value>@ {profession.company || 'unknown company'}</Value>
						<Divider />
						<Value style={GlobalStyles.bold}>
							{humanizeCurrency(profession.annual_income || '0')}
							/Year
						</Value>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						<Value style={GlobalStyles.bold}>Home</Value>
						<Value>- {family.family_location || 'unknown location'}</Value>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						<Value style={GlobalStyles.bold}>Work</Value>
						<Value>- {profession.work_city || 'unknown work city'}</Value>
					</View>
					{user_profile.describe_myself && !hideSelfDescription && (
						<View style={[GlobalStyles.row, styles.describeSelfContainer]}>
							{user_profile.describe_myself.map(description => (
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

export default ProfileCard;

const styles = StyleSheet.create({
	profileCard: {
		backgroundColor: 'white'
	},
	profileImage: {
		width: 100,
		height: 250,
		resizeMode: 'cover'
	},
	profileSummaryContainer: {
		padding: 10
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
	}
});
