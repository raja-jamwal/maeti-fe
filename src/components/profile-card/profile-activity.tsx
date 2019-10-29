import * as React from 'react';
import { StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/global';
import { View } from 'react-native';
import { Image } from 'react-native';
import Text from '../text';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { getUserProfileForId } from '../../store/reducers/user-profile-reducer';
import { UserProfile } from '../../store/reducers/account-defination';
import { formatDate, formatDuration } from '../../utils';

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
					<Text style={[styles.iconLabel, GlobalStyles.bold]}>
						{userProfile.responseRate}%
					</Text>
					<Text style={styles.iconLabel}>Response Rate</Text>
				</View>
				<View style={[GlobalStyles.expand, GlobalStyles.alignCenter]}>
					<Image
						style={styles.icon}
						source={require('../../assets/images/icons/response_time.png')}
					/>
					<Text style={[styles.iconLabel, GlobalStyles.bold]}>
						{formatDuration(userProfile.responseTime)}
					</Text>
					<Text style={styles.iconLabel}>Response Time</Text>
				</View>
				<View style={[GlobalStyles.expand, GlobalStyles.alignCenter]}>
					<Image
						style={styles.icon}
						source={require('../../assets/images/icons/last_login.png')}
					/>
					<Text style={[styles.iconLabel, GlobalStyles.bold]}>
						{formatDate(userProfile.lastLogin / 1000)}
					</Text>
					<Text style={styles.iconLabel}>Last Login</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	icon: {
		width: 80,
		height: 80,
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
