import { PhotosEntity, UserProfile } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { IRootState } from '../index';
import { ApiRequest } from 'src/utils';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { getLogger } from '../../utils/logger';
import { createSelector } from 'reselect';
import { updateUserProfile } from './user-profile-reducer';

export interface ISelfProfileState {
	profile?: UserProfile;
	uploading: boolean;
}
const defaultSelfProfileState: ISelfProfileState = {
	uploading: false
};

const ADD_SELF_PROFILE = 'ADD_SELF_PROFILE';
const SET_SELF_PROFILE_UPDATING = 'SET_SELF_PROFILE_UPDATING';
export const addSelfProfile = createAction<UserProfile>(ADD_SELF_PROFILE);
export const setSelfProfileUpdating = createAction<boolean>(SET_SELF_PROFILE_UPDATING);

const getSelfProfile = (state: IRootState) => state.selfProfile;

export const getSelfUserProfile = createSelector(
	getSelfProfile,
	selfProfile => selfProfile.profile || null
);

/**
 * @deprecated Riskier functions, don't use
 * This store might not be up to date with user-profile store
 * Fetch currentUserProfile from user-profile instead
 * i..e getUserProfileForId(getState(), currentUserProfileId)
 */
export const getCurrentUserProfile = getSelfUserProfile;
export const getSelfProfileId = createSelector(
	getSelfUserProfile,
	userProfile => {
		if (userProfile) return userProfile.id;
		return null;
	}
);

export const getIsCurrentProfileUpdating = createSelector(
	getSelfProfile,
	selfProfile => {
		if (!selfProfile) return false;
		return selfProfile.uploading;
	}
);

export const getCurrentUserProfileId = getSelfProfileId;

export const selfProfileReducer = handleActions(
	{
		[ADD_SELF_PROFILE]: (state, { payload }) => {
			const profile = (payload as any) as UserProfile;
			return {
				...state,
				profile: {
					...profile
				}
			};
		},
		[SET_SELF_PROFILE_UPDATING]: (state, { payload }) => {
			const isUpdating = (payload as any) as boolean;
			return {
				...state,
				uploading: isUpdating
			};
		}
	},
	defaultSelfProfileState
);
