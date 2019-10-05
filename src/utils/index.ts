import { isEmpty, forOwn } from 'lodash';

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

const ApiRequest = function(url, params) {
	const formData = new FormData();

	forOwn(params, (value, key) => {
		formData.append(key, value);
	});

	// stimulate slow network
	const delay = 0;

	return new Promise((resolve, reject) => {
		setTimeout(function() {
			const fetchOptions: any = {
				method: 'POST'
			};
			if (!isEmpty(params)) {
				fetchOptions['headers'] = {
					'Content-Type': 'multipart/form-data'
				};
				fetchOptions['body'] = formData;
			}
			fetch(url, fetchOptions)
				.then(response => {
					if (response.status !== 200) throw response.json();
					resolve(response.json());
				})
				.catch(err => reject(err));
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

export {
	LAKH_RUPEE,
	CRORE_RUPEE,
	calculateAge,
	yearsToTs,
	humanizeCurrency,
	ApiRequest,
	formatDate,
	formatDateTime
};
