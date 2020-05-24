import * as React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { Value } from '../text/index';
import GlobalStyles from '../../styles/global';
import { Message, UserProfile } from '../../store/reducers/account-defination';
import { formatDuration } from '../../utils';
import { isEmpty, head } from 'lodash';
import { isProfileBlocked } from '../../store/reducers/user-profile-reducer';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';

const defaultProfileImage = require('../../assets/images/placeholder.png');

interface IUserChannelProps {
	userProfile: UserProfile;
	latestMessage: Message;
	isProfileBlocked: boolean;
}

class UserChannel extends React.Component<IUserChannelProps> {
	render() {
		const { userProfile, latestMessage, isProfileBlocked } = this.props;
		if (isProfileBlocked) return null;
		const userProfileImage = !isEmpty(userProfile.photo) && head(userProfile.photo).url;
		return (
			<View style={[GlobalStyles.row, GlobalStyles.alignCenter, styles.container]}>
				<View style={GlobalStyles.paddedRight}>
					{!!userProfileImage && (
						<Image
							source={{
								uri: userProfileImage
							}}
							style={styles.avatar}
						/>
					)}
					{!userProfileImage && (
						<Image source={defaultProfileImage} style={styles.avatar} />
					)}
				</View>
				<View style={GlobalStyles.expand}>
					<View style={GlobalStyles.row}>
						<Value style={[GlobalStyles.bold, GlobalStyles.expand]}>
							{userProfile.fullName}
						</Value>
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
	}
});

const mapStateToProps = (state: IRootState, ownProps: IUserChannelProps) => {
	return {
		isProfileBlocked: isProfileBlocked(state, ownProps.userProfile.id)
	};
};

export default connect(
	mapStateToProps,
	null
)(UserChannel);
