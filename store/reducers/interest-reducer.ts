import { Interest, Pageable } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { ApiRequest } from '../../utils';
import { IRootState } from '../index';
import { API } from '../../config/API';
import { extractPageableResponse } from '../../utils/extract-pageable-response';
import { addProfile } from './user-profile-reducer';

export interface IInterestState {
	incoming: {
		profiles: {
			[profileId: number]: Interest;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	accepted: {
		profiles: {
			[profileId: number]: Interest;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	sent: {
		profiles: {
			[profileId: number]: Interest;
		};
		fetching: boolean;
		pageable: Pageable;
	};
}

const defaultInterestState: IInterestState = {
	incoming: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	accepted: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	sent: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	}
};

const ADD_INCOMING_INTEREST = 'ADD_INCOMING_INTEREST';
const ADD_INCOMING_INTEREST_PAGE = 'ADD_INCOMING_INTEREST_PAGE';
const SET_INCOMING_INTEREST_FETCHING = 'SET_INCOMING_INTEREST_FETCHING';

const ADD_ACCEPTED_INTEREST = 'ADD_ACCEPTED_INTEREST';
const ADD_ACCEPTED_INTEREST_PAGE = 'ADD_ACCEPTED_INTEREST_PAGE';
const SET_ACCEPTED_INTEREST_FETCHING = 'SET_ACCEPTED_INTEREST_FETCHING';

const ADD_SENT_INTEREST = 'ADD_SENT_INTEREST';
const ADD_SENT_INTEREST_PAGE = 'ADD_SENT_INTEREST_PAGE';
const SET_SENT_INTEREST_FETCHING = 'SET_SENT_INTEREST_FETCHING';

export const addIncomingInterest = createAction<Interest>(ADD_INCOMING_INTEREST);
export const addIncomingInterestPage = createAction<Pageable>(ADD_INCOMING_INTEREST_PAGE);
export const setIncomingInterestFetching = createAction<boolean>(SET_INCOMING_INTEREST_FETCHING);

export const addAcceptedInterest = createAction<Interest>(ADD_ACCEPTED_INTEREST);
export const addAcceptedInterestPage = createAction<Pageable>(ADD_ACCEPTED_INTEREST_PAGE);
export const setAcceptedInterestFetching = createAction<boolean>(SET_ACCEPTED_INTEREST_FETCHING);

export const addSentInterest = createAction<Interest>(ADD_SENT_INTEREST);
export const addSentInterestPage = createAction<Pageable>(ADD_SENT_INTEREST_PAGE);
export const setSentInterestFetching = createAction<boolean>(SET_SENT_INTEREST_FETCHING);

export const fetchIncomingInterests = function() {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const currentUserId = getState().selfProfile.id;
		const currentPage = getState().interests.incoming.pageable;

		if (!currentUserId || currentPage.last) return;

		console.log('fetching incoming');
		dispatch(setIncomingInterestFetching(true));

		const pageToRequest = currentPage.number + 1;
		return ApiRequest(API.INTEREST.LIST, {
			toUserId: currentUserId,
			page: pageToRequest
		})
			.then((response: any) => {
				const { items, page } = extractPageableResponse<Interest>(response);
				items.forEach(interest => {
					dispatch(addIncomingInterest(interest));
					const profile = interest.fromUser;
					dispatch(addProfile(profile));
				});

				dispatch(addIncomingInterestPage(page));
				dispatch(setIncomingInterestFetching(false));
			})
			.catch(err => {
				console.log('fetch failed for incoming interests ', err);
				dispatch(setIncomingInterestFetching(false));
			});
	};
};

export const fetchAcceptedInterests = function() {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {};
};

export const fetchSentInterests = function() {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const currentUserId = getState().selfProfile.id;
		const currentPage = getState().interests.sent.pageable;

		if (!currentUserId || currentPage.last) return;

		console.log('fetching sent');
		dispatch(setSentInterestFetching(true));

		const pageToRequest = currentPage.number + 1;
		return ApiRequest(API.INTEREST.LIST, {
			fromUserId: currentUserId,
			page: pageToRequest
		})
			.then((response: any) => {
				const { items, page } = extractPageableResponse<Interest>(response);

				items.forEach(interest => {
					dispatch(addSentInterest(interest));
					const profile = interest.toUser;
					dispatch(addProfile(profile));
				});

				dispatch(addSentInterestPage(page));
				dispatch(setSentInterestFetching(false));
			})
			.catch(err => {
				console.log('fetch failed for sent interests ', err);
				dispatch(setSentInterestFetching(false));
			});
	};
};

export const interestReducer = handleActions<IInterestState>(
	{
		[ADD_INCOMING_INTEREST]: (state, { payload }) => {
			const interest = (payload as any) as Interest;
			return {
				...state,
				incoming: {
					...state.incoming,
					profiles: {
						...state.incoming.profiles,
						[interest.interestIdentity.fromUserId]: interest
					}
				}
			};
		},
		[ADD_INCOMING_INTEREST_PAGE]: (state, { payload }) => {
			const page = (payload as any) as Pageable;
			return {
				...state,
				incoming: {
					...state.incoming,
					pageable: {
						...page
					}
				}
			};
		},
		[SET_INCOMING_INTEREST_FETCHING]: (state, { payload }) => {
			const fetching = !!payload;
			return {
				...state,
				incoming: {
					...state.incoming,
					fetching: fetching
				}
			};
		},
		[ADD_ACCEPTED_INTEREST]: (state, { payload }) => {
			const interest = (payload as any) as Interest;
			return {
				...state,
				accepted: {
					...state.accepted,
					profiles: {
						...state.accepted.profiles,
						[interest.interestIdentity.fromUserId]: interest
					}
				}
			};
		},
		[ADD_ACCEPTED_INTEREST_PAGE]: (state, { payload }) => {
			const page = (payload as any) as Pageable;
			return {
				...state,
				accepted: {
					...state.accepted,
					pageable: {
						...page
					}
				}
			};
		},
		[SET_ACCEPTED_INTEREST_FETCHING]: (state, { payload }) => {
			const fetching = !!payload;
			return {
				...state,
				accepted: {
					...state.accepted,
					fetching: fetching
				}
			};
		},
		[ADD_SENT_INTEREST]: (state, { payload }) => {
			const interest = (payload as any) as Interest;
			return {
				...state,
				sent: {
					...state.sent,
					profiles: {
						...state.sent.profiles,
						[interest.interestIdentity.fromUserId]: interest
					}
				}
			};
		},
		[ADD_SENT_INTEREST_PAGE]: (state, { payload }) => {
			const page = (payload as any) as Pageable;
			return {
				...state,
				sent: {
					...state.sent,
					pageable: {
						...page
					}
				}
			};
		},
		[SET_SENT_INTEREST_FETCHING]: (state, { payload }) => {
			const fetching = !!payload;
			return {
				...state,
				sent: {
					...state.sent,
					fetching: fetching
				}
			};
		}
	},
	defaultInterestState
);
