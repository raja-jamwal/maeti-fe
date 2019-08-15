import forOwn from 'lodash/forOwn';
const moment = require('moment');

/**
 * return the age from the timestamp
 * @param timestamp seconds since epoch
 */
const calculateAge = function(timestamp: number) {
	const today = new Date();
	const diff = today.getTime() - new Date(timestamp * 1000).getTime();
	const secondsInYear = 60 * 60 * 24 * 365;
	return Math.floor(diff / (secondsInYear * 1000));
};

const humanizeCurrency = function(value: number) {
	return `₹ ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data'
				},
				body: formData
			})
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

export { calculateAge, humanizeCurrency, ApiRequest, formatDate, formatDateTime };
