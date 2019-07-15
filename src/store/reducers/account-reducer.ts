// import * as AccountFixture from '../../fixtures/account.json';
import { Account as ILocalAccount } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { head } from 'lodash';
import { addProfile } from './user-profile-reducer';
import { fetchTags } from './tag-reducer';
import { addSelfProfile } from './self-profile-reducer';
import { ApiRequest } from '../../utils/index';
import { Notifications, Permissions } from 'expo';
import { IRootState } from '../index';
import { createSelector } from 'reselect';

export interface IAccountState extends ILocalAccount {}

const defaultAccountState: IAccountState = {} as ILocalAccount;

// selector
export const getAccount = (state: IRootState) => state.account || null;
export const getUserProfile = createSelector(
	getAccount,
	account => {
		if (!account) return null;
		return account.userProfile;
	}
);
export const getCurrentUserProfileId = createSelector(
	getUserProfile,
	userProfile => {
		if (!userProfile) return null;
		return userProfile.id;
	}
);

const ADD_ACCOUNT = 'ADD_ACCOUNT';
export const addAccount = createAction(ADD_ACCOUNT);

export const savePushToken = function(id: number) {
	return async (dispatch: Dispatch<any>, getState: () => any) => {
		console.log('get notifcation perms');
		const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		console.log('existingStatus ', existingStatus);

		let finalStatus = existingStatus;

		// only ask if permissions have not already been determined, because
		// iOS won't necessarily prompt the user a second time.
		if (existingStatus !== 'granted') {
			// Android remote notification permissions are granted during the app
			// install, so this will only ask on iOS
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}

		// Stop here if the user did not grant permissions
		if (finalStatus !== 'granted') {
			return;
		}

		let token = null;
		try {
			// Get the token that uniquely identifies this device
			token = await Notifications.getExpoPushTokenAsync();
			console.log('push token ', token);
		} catch (err) {}

		if (!token) return;

		return ApiRequest(API.TOKEN.SAVE, {
			id,
			token
		})
			.then((response: any) => {
				console.log('savePushToken');
			})
			.catch(err => {
				console.log('err happened while saving token ', err);
			});
	};
};

export const fetchAccount = function(id: number) {
	return (dispatch: Dispatch<any>, getState: () => any) => {
		console.log('fetch Account');
		if (!id) {
			console.log('dev invalid account id passed');
			return;
		}
		return fetch(`${API.ACCOUNTS}/${id}`)
			.then(response => {
				return response.json();
			})
			.then(json => {
				const account: ILocalAccount = json as ILocalAccount;
				const profile = account.userProfile;
				dispatch(addAccount(account));
				dispatch(addSelfProfile(profile));
				dispatch(addProfile(profile));
				dispatch(savePushToken(profile.id));
				console.log('addProfile dispatched');
				dispatch(fetchTags());
				return account;
			})
			.catch(err => {
				console.log('err happened while fetch ', err);
			});
	};
};

// add thunks here
export function createAccount() {
	return {};
}

export const accountReducer = handleActions<IAccountState>(
	{
		[ADD_ACCOUNT]: (_state, { payload }) => {
			// console.debug('add account called ', payload);
			const account = (payload as any) as ILocalAccount;
			return { ...account };
		}
	},
	defaultAccountState
);
