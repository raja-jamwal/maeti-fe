import * as React from 'react';
import {
	GiftedChat,
	IChatMessage,
	User,
	IMessage,
	Bubble,
	Send,
	InputToolbar
} from 'react-native-gifted-chat';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { IRootState } from '../store';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Channel, Message, UserProfile } from '../store/reducers/account-defination';
import { fetchMessages, postMessage } from '../store/reducers/message-reducer';
import { toArray, map, keys, sortBy, head, isEmpty } from 'lodash';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import Colors from '../constants/Colors';
import { getSelfUserProfile } from '../store/reducers/self-profile-reducer';
import { getLogger } from '../utils/logger';
import { IS_IOS } from '../utils';

const messageToChatMessage = (message: Message): IChatMessage => {
	return {
		_id: message.messageIdentity.id,
		text: message.message,
		createdAt: new Date(message.createdOn),
		user: userProfileToUser(message.fromUser)
	};
};

const userProfileToUser = (userProfile: UserProfile): User => {
	const user: User = {
		_id: userProfile.id,
		name: userProfile.fullName
	};

	const userProfileImage = !isEmpty(userProfile.photo) && head(userProfile.photo).url;

	if (userProfileImage) {
		user.avatar = userProfileImage;
	}

	return user;
};

interface IChatScreenMapStateToProps {
	channel: Channel;
	currentUserProfile: UserProfile;
	fetching: boolean;
	messages: Array<Message>;
	isLastPage: boolean;
}

interface IChatScreenMapDispatchToProps {
	fetchMessages: (channelId: number) => any;
	postMessage: (channelId: number, messageText: string) => any;
}

interface IChatScreenState {
	channelId?: number;
	messages: IMessage[];
}

type IChatScreenProps = NavigationInjectedProps &
	IChatScreenMapStateToProps &
	IChatScreenMapDispatchToProps;

class ChatScreen extends React.Component<IChatScreenProps, IChatScreenState> {
	logger = getLogger(ChatScreen);

	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam('title', '')
	});

	constructor(props: any) {
		super(props);
		this.state = {
			messages: [] as IMessage[]
		};
		this._hasMore = this._hasMore.bind(this);
	}

	mayBeLoadMessage() {
		const { navigation, fetchMessages } = this.props;
		const channelId = navigation.getParam('channelId');
		if (channelId && this.state.channelId !== channelId) {
			fetchMessages(channelId);
			this.setState({
				channelId,
				messages: []
			});
		}
	}

	mayBeUpdateMessages(messages: Message[]) {
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
		const { channel, messages, currentUserProfile } = this.props;
		this.mayBeLoadMessage();
		this.mayBeUpdateMessages(messages);
		if (!channel) return;
		const otherUserProfile =
			currentUserProfile.id === channel.toUser.id ? channel.fromUser : channel.toUser;
		this.props.navigation.setParams({ title: otherUserProfile.fullName });
	}

	UNSAFE_componentWillReceiveProps(nextProps: IChatScreenProps) {
		this.mayBeUpdateMessages(nextProps.messages);
	}

	onSend(messages: IMessage[] = []) {
		const channelId = this.props.navigation.getParam('channelId');
		if (!channelId) return;

		messages.forEach((message: any) => {
			this.props.postMessage(channelId, message.text);
		});

		this.setState(previousState => ({
			messages: GiftedChat.append(previousState.messages, messages)
		}));
	}

	renderBubble(props: any) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					left: {
						backgroundColor: 'white'
					},
					right: {
						backgroundColor: Colors.primaryDarkColor
					}
				}}
			/>
		);
	}

	renderSend(props: any) {
		return (
			<Send
				{...props}
				textStyle={{
					color: Colors.primaryDarkColor
				}}
			/>
		);
	}

	_hasMore() {
		const { channel, fetchMessages } = this.props;
		if (!channel) return;
		fetchMessages(channel.channelIdentity.id);
	}

	render() {
		const { currentUserProfile, fetching, isLastPage } = this.props;
		if (!currentUserProfile) return;
		return (
			<SafeAreaView style={{ flexDirection: 'column', flex: 1 }}>
				<View style={{ flex: 1 }}>
					<GiftedChat
						messages={this.state.messages}
						onSend={messages => this.onSend(messages)}
						user={userProfileToUser(currentUserProfile)}
						renderBubble={this.renderBubble}
						alwaysShowSend={true}
						loadEarlier={!isLastPage}
						isLoadingEarlier={fetching}
						onLoadEarlier={this._hasMore}
						listViewProps={{
							onEndReached: this._hasMore,
							onEndReachedThreshold: 50
						}}
						extraData={{ length: this.state.messages.length }}
					/>
				</View>
			</SafeAreaView>
		);
	}
}

const mapStateToProps = (state: IRootState, ownProps: any) => {
	const currentUserProfile = getSelfUserProfile(state);
	const channelId = ownProps.navigation.getParam('channelId');
	const channel = channelId && state.channels.channels[channelId];
	const messageState = channelId && state.messages[channelId];
	const fetching = (messageState && messageState.fetching) || false;
	const messages = (messageState && messageState.messages) || {};
	const isLastPage = (messageState && messageState.page && messageState.page.last) || false;
	return {
		channel,
		currentUserProfile,
		fetching,
		messages,
		isLastPage
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
