import * as React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Text, { Value } from '../text/index';
import GlobalStyles from '../../styles/global';
import { Message, UserProfile } from '../../store/reducers/account-defination';
import { formatDuration } from '../../utils';
import { isEmpty, head } from 'lodash';

const defaultProfileImage = require('../../assets/images/placeholder.png');

interface IUserChannelProps {
	userProfile: UserProfile;
	latestMessage: Message;
}

class UserChannel extends React.Component<IUserChannelProps> {
	render() {
		const { userProfile, latestMessage } = this.props;
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
		borderRadius: 25
	}
});

export default UserChannel;
