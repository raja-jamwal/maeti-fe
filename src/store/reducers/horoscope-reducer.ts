import { createAction, handleActions } from 'redux-actions';
import { IRootState } from '../index';
import { Dispatch } from 'redux';
import { ApiRequest } from '../../utils';
import { API } from '../../config/API';
import { getLogger } from '../../utils/logger';
import { createSelector } from 'reselect';

export interface IHoroscope {
	horoscope: any;
	planetLocation: any;
}

export interface IHoroscopeState {
	[userProfileId: number]: IHoroscope;
}

// selector
export const getHoroscopes = (state: IRootState) => state.horoscopes;
export const getHoroscopeFromState = (state: IRootState, userProfileId: number) =>
	state.horoscopes[userProfileId];
export const getHoroscopeForProfileId = createSelector(
	getHoroscopeFromState,
	horoscope => horoscope || null
);

const defaultHoroscopeState: IHoroscopeState = {};

interface IAddHoroscopePayload {
	userProfileId: number;
	horoscope: any;
	planetLocation: any;
}

const ADD_HOROSCOPE = 'ADD_HOROSCOPE';
export const addHoroscope = createAction<IAddHoroscopePayload>(ADD_HOROSCOPE);

export const fetchHoroscope = function(userProfileId: number) {
	const logger = getLogger(fetchHoroscope);
	return (dispatch: Dispatch, _getState: () => IRootState) => {
		return ApiRequest(API.HOROSCOPE.GET, {
			currentUserId: userProfileId
		})
			.then((response: any) => {
				const { horoscope, planetLocation } = response;
				console.log(response);
				dispatch(addHoroscope({ userProfileId, horoscope, planetLocation }));
				return response;
			})
			.catch(er => {
				logger.log(er);
			});
	};
};

export const horoscopeReducer = handleActions<IHoroscopeState>(
	{
		[ADD_HOROSCOPE]: (state, { payload }) => {
			const horoscopePayload = (payload as any) as IAddHoroscopePayload;
			return {
				...state,
				[horoscopePayload.userProfileId]: {
					horoscope: horoscopePayload.horoscope,
					planetLocation: horoscopePayload.planetLocation
				}
			};
		}
	},
	defaultHoroscopeState
);
