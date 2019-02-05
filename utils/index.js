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

export { calculateAge, humanizeCurrency };
