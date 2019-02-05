import React from 'react';
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
import PropTypes from 'prop-types';

class ProfileCard extends React.Component {
	fullWidth() {
		const screenWidth = Dimensions.get('window').width;
		const screenHeight = Dimensions.get('window').height;
		return {
			width: screenWidth
		};
	}

	render() {
		const {
			hideSelfDescription,
			profile,
			horoscope,
			profession,
			education,
			family
		} = this.props;
		return (
			<View style={styles.profileCard}>
				<Image
					source={require('../../assets/images/doctor-placeholder.jpg')}
					style={[styles.profileImage, this.fullWidth()]}
				/>
				<View style={styles.profileSummaryContainer}>
					<View>
						<Text style={[GlobalStyles.large, GlobalStyles.bold]}>
							{profile.fullName}
						</Text>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						<Value>Age {calculateAge(profile.dob)}</Value>
						<Divider />
						<Value>{profile.height} Ft</Value>
						<Divider />
						<Value>{horoscope.caste}</Value>
						<Value>, {horoscope.subCaste}</Value>
					</View>
					<View style={GlobalStyles.row}>
						<Value>{education.education}</Value>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						<Value style={GlobalStyles.bold}>{profession.designation}</Value>
						<Value>@ {profession.company}</Value>
						<Divider />
						<Value style={GlobalStyles.bold}>
							{humanizeCurrency(profession.annualIncome)}
							/Year
						</Value>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						<Value style={GlobalStyles.bold}>Home</Value>
						<Value>- {family.familyLocation}</Value>
					</View>
					<View style={[GlobalStyles.row, GlobalStyles.alignCenter]}>
						<Value style={GlobalStyles.bold}>Work</Value>
						<Value>- {profession.workCity}</Value>
					</View>
					{profile.describeMyself && !hideSelfDescription && (
						<View style={[GlobalStyles.row, styles.describeSelfContainer]}>
							{profile.describeMyself.map(description => (
								<Text style={styles.selfDescriptionChip} key={description.tagId}>
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

ProfileCard.propTypes = {
	accountId: PropTypes.string.isRequired
};

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
