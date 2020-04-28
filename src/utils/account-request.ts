import { AsyncStorage } from 'react-native';
import { isEmpty } from 'lodash';
import { AccountRequest, PendingAccount } from '../store/reducers/account-defination';

enum ACCOUNT_STORAGE {
	PENDING_ACCOUNT = 'pending_account'
}

export function getAccountRequest(): Promise<AccountRequest> {
	return AsyncStorage.getItem(ACCOUNT_STORAGE.PENDING_ACCOUNT).then((encodedAccount: any) => {
		if (isEmpty(encodedAccount)) {
			throw new Error('no pending account');
		}
		try {
			const pendingAccount = JSON.parse(encodedAccount);
			return pendingAccount as AccountRequest;
		} catch (er) {}
		throw new Error('no pending account');
	});
}

export function setAccountRequestFromPendingAccount(pendingAccount: PendingAccount) {
	return AsyncStorage.setItem(ACCOUNT_STORAGE.PENDING_ACCOUNT, pendingAccount.request);
}

export function removeAccountRequest() {
	return AsyncStorage.removeItem(ACCOUNT_STORAGE.PENDING_ACCOUNT);
}
