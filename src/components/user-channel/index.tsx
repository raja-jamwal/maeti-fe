import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Value } from '../text/index';
import GlobalStyles from '../../styles/global';
import { Message, UserProfile } from '../../store/reducers/account-defination';
import { formatDuration } from '../../utils';
import { isEmpty, head } from 'lodash';
import { getCurrentUserProfileId } from '../../store/reducers/account-reducer';
import { isProfileBlocked } from '../../store/reducers/user-profile-reducer';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { Avatar } from '../avatar';
interface IUserChannelProps {
	userProfile: UserProfile;
	latestMessage: Message;
	isProfileBlocked: boolean;
	currentProfileId: number;
}

class UserChannel extends React.Component<IUserChannelProps> {
	render() {
		const { userProfile, latestMessage, isProfileBlocked, currentProfileId } = this.props;
		if (isProfileBlocked) return null;
		const userProfileImage =
			(!isEmpty(userProfile.photo) && head(userProfile.photo).url) || undefined;
		const isLatestMessageFromOther = latestMessage.fromUser.id !== currentProfileId;
		return (
			<View style={[GlobalStyles.row, GlobalStyles.alignCenter, styles.container]}>
				<View style={GlobalStyles.paddedRight}>
					<Avatar userProfileImage={userProfileImage} />
				</View>
				<View style={GlobalStyles.expand}>
					<View style={GlobalStyles.row}>
						<Value style={[GlobalStyles.bold]}>{userProfile.fullName}</Value>
						{isLatestMessageFromOther && (
							<View style={styles.waitingTextContainer}>
								<Value style={styles.waitingText}>WAITING</Value>
							</View>
						)}
					</View>
					{latestMessage && (
						<View style={GlobalStyles.row}>
							<Value style={GlobalStyles.expand}>{latestMessage.message}</Value>
							<Value>{formatDuration(latestMessage.createdOn)}</Value>
						</View>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		padding: 8
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20
	},
	waitingTextContainer: {
		backgroundColor: '#ccc',
		borderRadius: 2
	},
	waitingText: {
		fontSize: 8,
		// margin: 2,
		padding: 4,
		borderRadius: 2,
		color: 'white',
		letterSpacing: 1.3
	}
});

const mapStateToProps = (state: IRootState, ownProps: IUserChannelProps) => {
	const currentProfileId = getCurrentUserProfileId(state);
	return {
		currentProfileId,
		isProfileBlocked: isProfileBlocked(state, ownProps.userProfile.id)
	};
};

export default connect(
	mapStateToProps,
	null
)(UserChannel);
