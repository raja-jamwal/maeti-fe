import React from 'react';
import { View, ScrollView, TouchableNativeFeedback } from 'react-native';
import MessageInInbox from '../components/message-in-inbox';
import _ from 'lodash';

export default class MessagesScreen extends React.Component {
	static navigationOptions = {
		title: 'Inbox'
	};

	constructor(props) {
		super(props);
		this.openChatView = this.openChatView.bind(this);
	}

	openChatView() {
		const { navigation } = this.props;
		navigation.push('ChatScreen');
	}

	render() {
		// we will need to add this inside a flatlist
		// we can't add all the nodes in the list
		// because of perf. issues
		return (
			<ScrollView>
				{_.range(10).map(key => {
					return (
						<TouchableNativeFeedback onPress={this.openChatView} key={key}>
							<View>
								<MessageInInbox />
							</View>
						</TouchableNativeFeedback>
					);
				})}
			</ScrollView>
		);
	}
}
