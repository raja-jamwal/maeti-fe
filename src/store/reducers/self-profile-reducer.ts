import { UserProfile } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { IRootState } from '../index';

export interface ISelfProfileState extends UserProfile {}
const defaultSelfProfileState: ISelfProfileState | {} = {};

const ADD_SELF_PROFILE = 'ADD_SELF_PROFILE';
export const addSelfProfile = createAction<UserProfile>(ADD_SELF_PROFILE);

export const getSelfProfileId = (state: IRootState) => {
	return state.selfProfile.id;
};

export const selfProfileReducer = handleActions(
	{
		[ADD_SELF_PROFILE]: (_state, { payload }) => {
			return payload as UserProfile;
		}
	},
	defaultSelfProfileState
);
