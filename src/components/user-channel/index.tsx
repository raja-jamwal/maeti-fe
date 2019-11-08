import * as React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Text from '../text/index';
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
					{
						!!userProfileImage && <Image
							source={{
								uri: userProfileImage,
								width: 50
							}}
							style={styles.avatar}
						/>
					}
					{
						!userProfileImage && <Image
							source={defaultProfileImage}
							style={styles.avatar}
						/>
					}
				</View>
				<View style={GlobalStyles.expand}>
					<View style={GlobalStyles.row}>
						<Text style={[GlobalStyles.bold, GlobalStyles.expand]}>
							{userProfile.fullName}
						</Text>
					</View>
					{latestMessage && (
						<View style={GlobalStyles.row}>
							<Text style={GlobalStyles.expand}>{latestMessage.message}</Text>
							<Text>{formatDuration(latestMessage.createdOn)}</Text>
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
		width: 50,
		height: 50,
		borderRadius: 25
	}
});

export default UserChannel;
