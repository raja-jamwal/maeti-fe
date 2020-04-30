import { Platform } from 'react-native';
import { isEmpty, forOwn } from 'lodash';
import { AsyncStorage } from 'react-native';
import { Updates } from 'expo';
import { simpleAlert } from '../components/alert/index';
import { getLogger } from './logger';

const moment = require('moment');
const secondsInYear = 60 * 60 * 24 * 365;
const LAKH_RUPEE = 100000;
const CRORE_RUPEE = 100 * LAKH_RUPEE;

/**
 * return the age from the timestamp
 * @param timestamp seconds since epoch
 */
const calculateAge = function(timestamp: number) {
	const today = new Date();
	const diff = today.getTime() - new Date(timestamp * 1000).getTime();
	return Math.floor(diff / (secondsInYear * 1000));
};

const yearsToTs = function(years: number) {
	return years * secondsInYear;
};

const humanizeCurrency = function(value: number, prefix: string) {
	return `${prefix ? prefix : ''} ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const logoutAccount = async () => {
	await AsyncStorage.removeItem('cea');
	await AsyncStorage.removeItem('token');
	await Updates.reloadFromCache();
};

const memomizedCERead = () => {
	let cea: string | null = null;
	return async () => {
		try {
			if (cea) return cea;
			cea = await AsyncStorage.getItem('cea');
			return cea;
		} catch (er) {
			return null;
		}
		return null;
	};
};

export const getCeStatus = memomizedCERead();

export const setCeStatus = async () => {
	await AsyncStorage.setItem('cea', 'true');
};

const memomizedTokenRead = () => {
	let token: string | null = null;
	return async () => {
		if (token) return token;
		token = await AsyncStorage.getItem('token');
		return token;
	};
};

const readToken = memomizedTokenRead();

const ApiRequest = function(url: string, params: any) {
	const logger = getLogger(ApiRequest);
	const formData = new FormData();

	forOwn(params, (value, key) => {
		formData.append(key, value);
	});

	// stimulate slow network
	const delay = 0;

	return new Promise((resolve, reject) => {
		setTimeout(async function() {
			const fetchOptions: any = {
				method: 'POST'
			};
			if (!isEmpty(params)) {
				fetchOptions['headers'] = {
					'Content-Type': 'multipart/form-data'
				};
				fetchOptions['body'] = formData;
			}
			// If we've token, add Authorization header
			const token = await readToken();
			if (!isEmpty(token)) {
				if (!fetchOptions['headers']) {
					fetchOptions['headers'] = {};
				}
				fetchOptions['headers']['Authorization'] = token;
			} else {
				logger.log('unauthorized request ', url);
			}
			fetch(url, fetchOptions)
				.then(async response => {
					if (response.status === 401) {
						logger.log('logging out unauthorized ', url);
						return simpleAlert('Unauthorized', 'Please login again', async () => {
							await logoutAccount();
							resolve({});
						});
					}
					if (response.status !== 200) throw response.json();
					resolve(response.json());
				})
				.catch(err => err.then((e: any) => reject(e)));
		}, delay);
	});
};

/**
 *
 * @param ts - epoch in seconds
 */
const formatDate = (ts: number) => {
	const date = new Date(ts * 1000);
	return moment(date).format('dddd, MMMM Do YYYY');
};

const formatDateTime = (ts: number) => {
	const date = new Date(ts * 1000);
	return moment(date).format('dddd, MMMM Do YYYY, h:mm a');
};

/**
 *
 * @param ts - epoch in milliseconds
 */
const formatDuration = (ts: number) => {
	const currentTs = new Date().getTime();
	return moment.duration(currentTs - ts).humanize() + ' ago';
};

/**
 *
 * @param diff
 */
const formatTsAsDuration = (diff: number) => {
	return moment.duration(diff).humanize();
};

const getCurrentUnixEpoch = () => {
	return Math.floor(new Date().getTime() / 1000);
};

const IS_IOS = Platform.OS === 'ios';
const IS_ANDROID = Platform.OS === 'android';

export {
	LAKH_RUPEE,
	CRORE_RUPEE,
	calculateAge,
	yearsToTs,
	humanizeCurrency,
	ApiRequest,
	formatDate,
	formatDateTime,
	formatDuration,
	formatTsAsDuration,
	getCurrentUnixEpoch,
	IS_IOS,
	IS_ANDROID
};
