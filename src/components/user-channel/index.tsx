import * as React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Text from '../text/index';
import GlobalStyles from '../../styles/global';
import { Message, UserProfile } from '../../store/reducers/account-defination';

interface IUserChannelProps {
	userProfile: UserProfile;
	latestMessage: Message;
}

class UserChannel extends React.Component<IUserChannelProps> {
	render() {
		const { userProfile, latestMessage } = this.props;

		return (
			<View style={[GlobalStyles.row, GlobalStyles.alignCenter, styles.container]}>
				<View style={GlobalStyles.paddedRight}>
					<Image
						source={require('../../assets/images/doctor-placeholder.jpg')}
						style={styles.avatar}
					/>
				</View>
				<View style={GlobalStyles.expand}>
					<View style={GlobalStyles.row}>
						<Text style={[GlobalStyles.bold, GlobalStyles.expand]}>
							{userProfile.fullName}
						</Text>
						{/*<Text>1</Text>*/}
					</View>
					<View style={GlobalStyles.row}>
						<Text style={GlobalStyles.expand}>{latestMessage.message}</Text>
						<Text>{latestMessage.createdOn}</Text>
					</View>
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
