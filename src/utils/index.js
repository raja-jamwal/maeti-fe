import keys from 'lodash/keys';
import forEach from 'lodash/forEach';
import forOwn from 'lodash/forOwn';
import { API } from '../config/API';

/**
 * return the age from the timestamp
 * @param timestamp seconds since epoch
 */
const calculateAge = function(timestamp) {
	const today = new Date();
	const diff = today.getTime() - new Date(timestamp * 1000).getTime();
	const secondsInYear = 60 * 60 * 24 * 365;
	return Math.floor(diff / (secondsInYear * 1000));
};

const humanizeCurrency = function(value) {
	return `₹ ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

const ApiRequest = function(url, params) {
	const formData = new FormData();

	forOwn(params, (value, key) => {
		formData.append(key, value);
	});

	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'multipart/form-data'
		},
		body: formData
	}).then(response => {
		if (response.status !== 200) throw response.json();
		return response.json();
	});
};

export { calculateAge, humanizeCurrency, ApiRequest };
