import { Message, Pageable } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { IRootState } from '../index';
import { API } from '../../config/API';
import { ApiRequest } from '../../utils/index';
import { extractPageableResponse } from '../../utils/extract-pageable-response';
import { addChannel } from './channel-reducer';

export interface IMessageState {
	[channelId: number]: {
		messages: {
			[messageId: number]: Message;
		};
		fetching: boolean;
		page: Pageable;
	};
}

const defaultMessageState: IMessageState = {};

const ADD_MESSAGE = 'ADD_MESSAGE';
const ADD_MESSAGE_PAGE = 'ADD_MESSAGE_PAGE';
const SET_MESSAGE_FETCHING = 'SET_MESSAGE_FETCHING';

export const addMessage = createAction<Message>(ADD_MESSAGE);
export const addMessagePage = createAction<any>(ADD_MESSAGE_PAGE);
export const setMessageFetching = createAction<any>(SET_MESSAGE_FETCHING);

export const fetchMessages = function(channelId: number) {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const channel = getState().messages[channelId];

		if (channel && channel.page.last) {
			return;
		}

		let pageNumber = -1;
		if (channel) {
			pageNumber = channel.page.number;
		}
		pageNumber += 1;

		dispatch(setMessageFetching({ channelId, fetching: true }));

		console.log('fetching messages');

		return ApiRequest(API.MESSAGE.LIST, {
			channelId,
			page: pageNumber
		})
			.then((response: any) => {
				const { items, page } = extractPageableResponse<Message>(response);
				console.log('messages ', items.length);
				items.forEach(message => {
					dispatch(addMessage(message));
					//
					// should we update profiles in store?
					//
				});
				dispatch(addMessagePage({ channelId, page }));
				dispatch(setMessageFetching({ channelId, fetching: false }));
			})
			.catch(err => {
				console.log('fetch failed for messages ', err);
				dispatch(setMessageFetching({ channelId, fetching: false }));
			});
	};
};

export const postMessage = function(channelId: number, messageText: string) {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const currentUserId = getState().selfProfile.id;
		const channel = getState().channels.channels[channelId];
		if (!channel || !currentUserId) return;
		return ApiRequest(API.MESSAGE.SAVE, {
			channelId,
			messageText,
			fromUserId: currentUserId,
			toUserId: channel.toUser.id
		})
			.then((response: Message) => {
				console.log('message should be saved');
				dispatch(addMessage(response));
				////
				/// update latest message in local channel store
				channel.latestMessage = response;
				dispatch(addChannel(channel));
			})
			.catch(err => {
				console.log('err post message ', err);
			});
	};
};

export const messageReducer = handleActions<IMessageState>(
	{
		[ADD_MESSAGE]: (state, { payload }) => {
			const message = (payload as any) as Message;
			const channelId = message.messageIdentity.channelId;
			return {
				...state,
				[channelId]: {
					...state[channelId],
					messages: {
						...state[channelId].messages,
						[message.messageIdentity.id]: message
					}
				}
			};
		},
		[ADD_MESSAGE_PAGE]: (state, { payload }) => {
			const { channelId, page } = payload as any;
			return {
				...state,
				[channelId]: {
					...state[channelId],
					page: {
						...page
					}
				}
			};
		},
		[SET_MESSAGE_FETCHING]: (state, { payload }) => {
			const { channelId, fetching } = payload as any;
			return {
				...state,
				[channelId]: {
					...state[channelId],
					fetching
				}
			};
		}
	},
	defaultMessageState
);
