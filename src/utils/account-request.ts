import { AsyncStorage } from 'react-native';
import { isEmpty } from 'lodash';

enum ACCOUNT_STORAGE {
	PENDING_ACCOUNT = 'new_pending_account'
}

export function getAccountRequest(intialObject: any): Promise<any> {
	return AsyncStorage.getItem(ACCOUNT_STORAGE.PENDING_ACCOUNT).then((encodedAccount: any) => {
		if (isEmpty(encodedAccount)) {
			throw new Error('no pending account');
		}
		try {
			const pendingAccount = JSON.parse(encodedAccount);
			return Object.assign(intialObject, pendingAccount);
		} catch (er) {}
		throw new Error('no pending account');
	});
}

export function setAccountRequestFromPendingAccount(pendingAccount: any) {
	return AsyncStorage.setItem(ACCOUNT_STORAGE.PENDING_ACCOUNT, JSON.stringify(pendingAccount));
}

export function removeAccountRequest() {
	return AsyncStorage.removeItem(ACCOUNT_STORAGE.PENDING_ACCOUNT);
}
