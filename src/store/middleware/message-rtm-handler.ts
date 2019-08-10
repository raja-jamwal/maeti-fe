import { addRtmHandler, RTMHandlerCallback } from './rtm-middleware';
import { getLogger } from '../../utils/logger';
import { addMessage } from '../reducers/message-reducer';
import { Message } from '../reducers/account-defination';
import { addChannel, getChannelForId } from '../reducers/channel-reducer';

export const messageRtmHandler: RTMHandlerCallback = (store: any, payload) => {
	const logger = getLogger(messageRtmHandler);
	if (!payload) {
		logger.log('invalid message from RTM');
		return;
	}
	logger.log('Trying to upsert new message from RTM');
	const message = (payload as any) as Message;
	/**
		Check if we need to update the latest message in a channel
	 */
	const channel = getChannelForId(store.getState(), message.messageIdentity.channelId);
	/**
		We've existing channel in store, i.e user has opened the inbox sometime
	 */
	if (channel) {
		channel.latestMessage = message;
		store.dispatch(addChannel(channel));
	}
	store.dispatch(addMessage(message));
	return;
};

addRtmHandler('message', messageRtmHandler);
