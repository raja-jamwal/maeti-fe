import * as React from 'react';
import { GiftedChat, IChatMessage, User } from 'react-native-gifted-chat';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { IRootState } from '../store';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Channel, Message, UserProfile } from '../store/reducers/account-defination';
import { fetchMessages, postMessage } from '../store/reducers/message-reducer';
import { toArray, map, keys, sortBy } from 'lodash';

const messageToChatMessage = (message: Message): IChatMessage => {
	return {
		_id: message.messageIdentity.id,
		text: message.message,
		createdAt: new Date(message.createdOn),
		user: userProfileToUser(message.fromUser)
	};
};

const userProfileToUser = (userProfile: UserProfile): User => {
	return {
		_id: userProfile.id,
		name: userProfile.fullName
	};
};

interface IChatScreenMapStateToProps {
	channel: Channel;
	currentUserProfile: UserProfile;
	fetching: boolean;
	messages: Array<Message>;
}

interface IChatScreenMapDispatchToProps {
	fetchMessages: (channelId: number) => any;
	postMessage: (channelId: number, messageText: string) => any;
}

class ChatScreen extends React.Component<
	NavigationInjectedProps & IChatScreenMapStateToProps & IChatScreenMapDispatchToProps
> {
	state = {
		channelId: null,
		messages: []
	};

	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam('title', '')
	});

	mayBeLoadMessage() {
		const { navigation, fetchMessages } = this.props;
		const channelId = navigation.getParam('channelId');
		if (channelId && this.state.channelId !== channelId) {
			// fetch message for channel here
			fetchMessages(channelId);
			this.setState({
				channelId
			});
		}
	}

	mayBeUpdateMessages() {
		const { messages } = this.props;
		const stateMessages = this.state.messages;
		if (stateMessages.length < keys(messages).length) {
			this.setState({
				messages: map(
					sortBy(toArray(messages), 'createdOn').reverse(),
					messageToChatMessage
				)
			});
		}
	}

	componentWillMount() {
		const { channel } = this.props;
		console.log('chat-screen will mount');
		this.mayBeLoadMessage();
		this.mayBeUpdateMessages();
		if (!channel) return;
		this.props.navigation.setParams({ title: channel.toUser.fullName });
	}

	componentWillReceiveProps() {
		console.log('chat-screen will recv props');
		this.mayBeUpdateMessages();
	}

	onSend(messages = []) {
		const channelId = this.props.navigation.getParam('channelId');
		if (!channelId) return;

		messages.forEach((message: any) => {
			console.log(message);
			this.props.postMessage(channelId, message.text);
		});

		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages)
		}));
	}

	render() {
		const { currentUserProfile } = this.props;
		if (!currentUserProfile) return;
		return (
			<GiftedChat
				messages={this.state.messages}
				onSend={messages => this.onSend(messages)}
				user={userProfileToUser(currentUserProfile)}
			/>
		);
	}
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
	const currentUserProfile = state.selfProfile;
	const channelId = ownProps.navigation.getParam('channelId');
	const channel = channelId && state.channels.channels[channelId];
	console.log('channelId ', channelId);
	const messageState = channelId && state.messages[channelId];
	// console.log('messageState ', messageState && messageState.messages);
	const fetching = (messageState && messageState.fetching) || false;
	const messages = (messageState && messageState.messages) || {};
	return {
		channel,
		currentUserProfile,
		fetching,
		messages
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchMessages: bindActionCreators(fetchMessages, dispatch),
		postMessage: bindActionCreators(postMessage, dispatch)
	};
};

export default withNavigation(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ChatScreen)
);
