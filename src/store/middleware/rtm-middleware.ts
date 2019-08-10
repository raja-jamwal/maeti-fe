import * as Stomp from '@stomp/stompjs';
import { API } from 'src/config/API.ts';
import { createAction } from 'redux-actions';
import { CompatClient } from '@stomp/stompjs';
import { getLogger } from '../../utils/logger';
import { getCurrentUserProfileId } from '../reducers/self-profile-reducer';
const SockJS = require('sockjs-client/dist/sockjs.js');

let client: CompatClient | null = null;

export type RTMHandlerCallback = (store: any, payload: any) => any;
interface IRTMHandlers {
	[event_name: string]: RTMHandlerCallback;
}

const handlers: IRTMHandlers = {};

export const addRtmHandler = (event: string, handler: RTMHandlerCallback): void => {
	handlers[event] = handler;
};

// Actions
enum ACTIONS {
	RTM_CONNECT = 'RTM_CONNECT'
}

export const connectRTM = createAction(ACTIONS.RTM_CONNECT);

export const rtmMiddleware = store => next => action => {
	const logger = getLogger(rtmMiddleware);

	switch (action.type) {
		case ACTIONS.RTM_CONNECT:
			// socket = new SockJS(API.RTM.CONNECT);
			client = Stomp.Stomp.over(function sockFactory() {
				return new SockJS(API.RTM.CONNECT);
			});
			client.connect({}, function(frame) {
				logger.log('RTM connected');
				if (!client) {
					logger.log('No WS client, closing');
					return;
				}

				const currentProfileId = getCurrentUserProfileId(store.getState());
				if (!currentProfileId) {
					logger.log('Cant find currentProfileId');
					return;
				}

				logger.log(`Subscribing rtm updates for profileId ${currentProfileId}`);

				client.subscribe('/topic/' + currentProfileId, function(data) {
					try {
						const text = (data.body || '{}').trim();
						logger.log('RTM message', data.body);
						const message = JSON.parse(text);
						const type = message.type;
						if (!type) {
							logger.log('invalid rtm message type');
							return;
						}
						const payload = message.payload;
						if (typeof handlers[type] === 'function') {
							handlers[type](store, payload);
						}
					} catch (er) {
						logger.log(er);
					}
				});
			});
			break;
		default:
			break;
	}

	return next(action);
};
