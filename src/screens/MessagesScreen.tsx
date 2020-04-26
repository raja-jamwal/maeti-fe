import * as React from 'react';
import { View, TouchableNativeFeedback, FlatList, StyleSheet, Text } from 'react-native';
import UserChannel from '../components/user-channel/index';
import { isEmpty } from 'lodash';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { IRootState } from '../store/index';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Channel } from '../store/reducers/account-defination';
import { fetchChannels, setChannelRefreshing } from '../store/reducers/channel-reducer';
import { Throbber } from '../components/throbber/throbber';
import { toArray, sortBy } from 'lodash';
import Color from '../constants/Colors';
import TouchableBtn from '../components/touchable-btn/touchable-btn';

interface IMessageScreenMapStateToProps {
	channels: Array<Channel>;
	fetching: boolean;
	totalChannels: number;
}

interface IMessageScreenMapDispatchToProps {
	fetchChannels: () => any;
	setChannelRefreshing: () => any;
}

interface IMessageScreenState {
	isFetchingMore: boolean;
}

class MessagesScreen extends React.PureComponent<
	NavigationInjectedProps & IMessageScreenMapStateToProps & IMessageScreenMapDispatchToProps,
	IMessageScreenState
> {
	static navigationOptions = {
		title: 'Inbox'
	};

	constructor(props: any) {
		super(props);
		this.state = {
			isFetchingMore: false
		};
		this.openChatView = this.openChatView.bind(this);
		this._handleMore = this._handleMore.bind(this);
	}

	componentWillMount() {
		const { fetchChannels } = this.props;
		fetchChannels();
	}

	componentWillReceiveProps(nextProps: any) {
		if (!nextProps.fetching) {
			this.setState({
				isFetchingMore: false
			});
		}
	}

	openChatView(channelId: number) {
		const { navigation } = this.props;
		navigation.push('ChatScreen', { channelId });
	}

	keyExtractor(channel: Channel) {
		return channel.channelIdentity.id.toString();
	}

	getChannels(): Array<Channel> {
		const { channels } = this.props;
		return sortBy(toArray(channels), 'updatedOn');
	}

	renderChannel(channel: Channel) {
		return (
			<TouchableBtn
				onPress={() => this.openChatView(channel.channelIdentity.id)}
				key={channel.channelIdentity.id}
			>
				<View>
					<UserChannel
						userProfile={channel.toUser}
						latestMessage={channel.latestMessage}
					/>
				</View>
			</TouchableBtn>
		);
	}

	_handleMore() {
		const { fetchChannels } = this.props;
		fetchChannels();
		this.setState({
			isFetchingMore: true
		});
	}

	async _handleRefresh() {
		const { fetchChannels, setChannelRefreshing } = this.props;
		await setChannelRefreshing();
		await fetchChannels();
	}

	render() {
		const { fetching } = this.props;
		const { isFetchingMore } = this.state;
		const loaderClasses = isFetchingMore
			? [styles.loading, styles.loaderBottom]
			: [styles.loading, styles.loaderTop];
		const isEmptyInbox = isEmpty(this.getChannels());
		return (
			<View style={styles.container}>
				{!isEmptyInbox && (
					<FlatList
						keyExtractor={this.keyExtractor}
						data={this.getChannels()}
						renderItem={({ item }) => this.renderChannel(item)}
						onEndReached={this._handleMore}
						onEndReachedThreshold={100}
						refreshing={fetching}
						onRefresh={() => this._handleRefresh()}
					/>
				)}
				{isEmptyInbox && !fetching && (
					<View style={styles.emptyInbox}>
						<Text style={styles.lightText}>No messages</Text>
						<Text style={styles.lightText}>Send interests to begin messaging</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		marginTop: 8
	},
	inboxEmoji: {
		fontSize: 25,
		paddingBottom: 10
	},
	emptyInbox: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		zIndex: 1
	},
	loaderTop: {
		top: 10
	},
	loaderBottom: {
		bottom: 10
	},
	lightText: {
		color: Color.offWhite,
		fontSize: 18
	}
});

const mapStateToProps = (state: IRootState) => {
	const channels = state.channels.channels;
	const fetching = state.channels.fetching;
	const totalChannels = state.channels.pageable.totalElements;

	return {
		channels,
		fetching,
		totalChannels
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchChannels: bindActionCreators(fetchChannels, dispatch),
		setChannelRefreshing: bindActionCreators(setChannelRefreshing, dispatch)
	};
};

export default withNavigation(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(MessagesScreen)
);
