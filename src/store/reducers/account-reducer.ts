// import * as AccountFixture from '../../fixtures/account.json';
import { Account as ILocalAccount, Account } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { head } from 'lodash';
import { addProfile } from './user-profile-reducer';
import { fetchTags } from './tag-reducer';
import { addSelfProfile } from './self-profile-reducer';
import { ApiRequest } from '../../utils/index';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { IRootState } from '../index';
import { createSelector } from 'reselect';
import { getLogger } from '../../utils/logger';

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
	const logger = getLogger(savePushToken);
	return async (dispatch: Dispatch<any>, getState: () => any) => {
		logger.log('get notification perms');
		const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
		logger.log('existingStatus ', existingStatus);

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
			logger.log('push token ', token);
		} catch (err) {}

		if (!token) return;

		return ApiRequest(API.TOKEN.SAVE, {
			id,
			token
		})
			.then((response: any) => {
				logger.log('savePushToken');
			})
			.catch(err => {
				logger.log('err happened while saving token ', err);
			});
	};
};

export const fetchAccount = function(id: number) {
	const logger = getLogger(fetchAccount);
	return (dispatch: Dispatch<any>, getState: () => any) => {
		if (!id) {
			logger.log('dev invalid account id passed');
			return;
		}
		return ApiRequest(API.ACCOUNT.GET, {
			phoneNumber: id
		})
			.then((json: Account) => {
				const account: ILocalAccount = json as ILocalAccount;
				const profile = account.userProfile;
				dispatch(addAccount(account));
				dispatch(addSelfProfile(profile));
				dispatch(addProfile(profile));
				dispatch(savePushToken(profile.id));
				logger.log('addProfile dispatched');
				dispatch(fetchTags());
				return account;
			})
			.catch((err: any) => {
				logger.log('err happened while fetch ', err);
			});
	};
};

export const accountReducer = handleActions<IAccountState>(
	{
		[ADD_ACCOUNT]: (_state, { payload }) => {
			const account = (payload as any) as ILocalAccount;
			return { ...account };
		}
	},
	defaultAccountState
);
