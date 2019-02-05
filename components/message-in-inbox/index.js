import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Text from '../text';
import GlobalStyles from '../../styles/global';
import { withNavigation } from 'react-navigation';

class MessageInInbox extends React.Component {
	render() {
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
						<Text style={[GlobalStyles.bold, GlobalStyles.expand]}>Vishnu Raut</Text>
						<Text>1</Text>
					</View>
					<View style={GlobalStyles.row}>
						<Text style={GlobalStyles.expand}>Hello</Text>
						<Text>31 Jan, 9:59 PM</Text>
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

export default MessageInInbox;
// export default withNavigation(MessageInInbox);
