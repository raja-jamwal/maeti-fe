// import * as AccountFixture from '../../fixtures/account.json';
import { Account as ILocalAccount } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { head } from 'lodash';
import { addProfile } from './user-profile-reducer';
import { fetchTags } from './tag-reducer';
import { addSelfProfile } from './self-profile-reducer';

export interface IAccountState extends ILocalAccount {}

const defaultAccountState: IAccountState = {} as ILocalAccount;

const ADD_ACCOUNT = 'ADD_ACCOUNT';
export const addAccount = createAction(ADD_ACCOUNT);

export const fetchAccount = function() {
	return (dispatch: Dispatch<any>, getState: () => any) => {
		console.log('fetch Account');
		return fetch(API.ACCOUNTS)
			.then(response => {
				return response.json();
			})
			.then(json => {
				const accounts = json._embedded.accounts;
				const account: ILocalAccount = head(accounts) as ILocalAccount;
				const profile = account.userProfile;
				dispatch(addAccount(account));
				dispatch(addSelfProfile(profile));
				dispatch(addProfile(profile));
				// console.log(accounts);
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
