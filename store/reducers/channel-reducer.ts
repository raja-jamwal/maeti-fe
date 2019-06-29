import { Channel, Pageable } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { IRootState } from '../index';
import { API } from '../../config/API';
import { ApiRequest } from '../../utils';
import { extractPageableResponse } from '../../utils/extract-pageable-response';
import { addProfile } from './user-profile-reducer';

export interface IChannelState {
	channels: {
		[channelId: number]: Channel;
	};
	fetching: boolean;
	pageable: Pageable;
}

const defaultChannelState: IChannelState = {
	channels: {},
	fetching: false,
	pageable: {
		last: false,
		totalPages: 0,
		number: -1,
		totalElements: 0
	}
};

const ADD_CHANNEL = 'ADD_CHANNEL';
const SET_CHANNEL_FETCHING = 'SET_CHANNEL_FETCHING';
const ADD_CHANNEL_PAGE = 'ADD_CHANNEL_PAGE';

export const addChannel = createAction<Channel>(ADD_CHANNEL);
export const addChannelPage = createAction<Pageable>(ADD_CHANNEL_PAGE);
export const setChannelFetching = createAction<boolean>(SET_CHANNEL_FETCHING);

export const fetchChannels = function() {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const currentUserId = getState().selfProfile.id;
		const currentPage = getState().channels.pageable;
		if (!currentUserId || currentPage.last) return;

		console.log('fetching channels');
		dispatch(setChannelFetching(true));

		const pageToRequest = currentPage.number + 1;
		return ApiRequest(API.CHANNEL.LIST, {
			fromUserId: currentUserId,
			page: pageToRequest
		})
			.then((response: any) => {
				const { items, page } = extractPageableResponse<Channel>(response);

				items.forEach(channel => {
					// Channel are bi-directional entities
					// Therefore it's required to add this
					// tricky logic in client
					if (
						channel.channelIdentity.fromUserId !== currentUserId &&
						channel.channelIdentity.toUserId === currentUserId
					) {
						const toUser = { ...channel.toUser };
						const fromUser = { ...channel.fromUser };
						channel.fromUser = toUser;
						channel.toUser = fromUser;
					}
					dispatch(addChannel(channel));
					dispatch(addProfile(channel.toUser));
				});

				dispatch(addChannelPage(page));
				dispatch(setChannelFetching(false));
			})
			.catch(err => {
				console.log('fetch failed for channels ', err);
				dispatch(setChannelFetching(false));
			});
	};
};

export const channelReducer = handleActions<IChannelState>(
	{
		[ADD_CHANNEL]: (state, { payload }) => {
			const channel = (payload as any) as Channel;
			return {
				...state,
				channels: {
					...state.channels,
					[channel.channelIdentity.id]: channel
				}
			};
		},
		[SET_CHANNEL_FETCHING]: (state, { payload }) => {
			const fetching = !!payload;
			return {
				...state,
				fetching
			};
		},
		[ADD_CHANNEL_PAGE]: (state, { payload }) => {
			const page = (payload as any) as Pageable;
			return {
				...state,
				pageable: {
					...page
				}
			};
		}
	},
	defaultChannelState
);
