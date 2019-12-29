import * as React from 'react';
import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/global';
import { View } from 'react-native';
import { Image } from 'react-native';
import Text, { Value } from '../text';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { getUserProfileForId } from '../../store/reducers/user-profile-reducer';
import { UserProfile } from '../../store/reducers/account-defination';
import { formatDate, formatDuration, formatTsAsDuration } from '../../utils';

interface IProfileActivityProps {
	userProfileId: number;
}

interface IProfileActivityMapStateToProps {
	userProfile: UserProfile;
}

class ProfileActivity extends React.Component<IProfileActivityMapStateToProps> {
	render() {
		const { userProfile } = this.props;
		return (
			<View style={GlobalStyles.row}>
				<View style={[GlobalStyles.expand, GlobalStyles.alignCenter]}>
					<Image
						style={styles.icon}
						source={require('../../assets/images/icons/response_rate.png')}
					/>
					<Value style={[styles.iconLabel, GlobalStyles.bold]}>
						{userProfile.responseRate}%
					</Value>
					<Value style={styles.iconLabel}>Response Rate</Value>
				</View>
				<View style={[GlobalStyles.expand, GlobalStyles.alignCenter]}>
					<Image
						style={styles.icon}
						source={require('../../assets/images/icons/response_time.png')}
					/>
					<Value style={[styles.iconLabel, GlobalStyles.bold]}>
						{formatTsAsDuration(userProfile.responseTime)}
					</Value>
					<Value style={styles.iconLabel}>Response Time</Value>
				</View>
				<View style={[GlobalStyles.expand, GlobalStyles.alignCenter]}>
					<Image
						style={styles.icon}
						source={require('../../assets/images/icons/last_login.png')}
					/>
					<Value style={[styles.iconLabel, GlobalStyles.bold]}>
						{formatDate(userProfile.lastLogin / 1000)}
					</Value>
					<Value style={styles.iconLabel}>Last Login</Value>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	icon: {
		width: 40,
		height: 40,
		resizeMode: 'contain'
	},
	iconLabel: {
		textAlign: 'center'
	}
});

export default connect(
	(state: IRootState, props: IProfileActivityProps) => ({
		userProfile: getUserProfileForId(state, props.userProfileId)
	}),
	null
)(ProfileActivity);
