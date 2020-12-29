import { getConfig } from './config';

const config = getConfig();

export const API = {
	ACCOUNTS: `${config.server}/api/accounts`,

	AUTH: {
		SIGNIN: `${config.server}/api/auth.signin`
	},

	VERIFICATION: {
		SAVE: `${config.server}/api/verification.save`
	},

	EDUCATION: {
		SAVE: `${config.server}/api/education.save`
	},

	PROFESSION: {
		SAVE: `${config.server}/api/profession.save`
	},

	HOROSCOPE: {
		SAVE: `${config.server}/api/horoscope.save`,
		GET: `${config.server}/api/horoscope.get`,
		MATCH: `${config.server}/api/horoscope.match`
	},

	INVESTMENT: {
		SAVE: `${config.server}/api/investment.save`
	},

	LIFESTYLE: {
		SAVE: `${config.server}/api/lifestyle.save`
	},

	CONTACT_INFORMATION: {
		SAVE: `${config.server}/api/contactInformation.save`
	},

	USER_REFERENCE: {
		SAVE: `${config.server}/api/userReference.save`
	},

	FAMILY: {
		SAVE: `${config.server}/api/family.save`
	},

	FAMILY_OTHER_INFORMATION: {
		SAVE: `${config.server}/api/familyOtherInformation.save`
	},

	PREFERENCE: {
		SAVE: `${config.server}/api/preference.save`
	},

	// @depreceated
	TAGS: `${config.server}/api/tags`,

	TAG: {
		FIND_ALL: `${config.server}/api/tags.findAll`
	},

	FAVOURITE: {
		GET: `${config.server}/api/favourite.get`,
		LIST: `${config.server}/api/favourite.list`,
		SAVE: `${config.server}/api/favourite.save`
	},

	ADDED_TO_FAVOURITE: {
		SEARCH: `${config.server}/api/addToFavourite.search`,
		MUTUAL_MATCHES: `${config.server}/api/mutualMatches.search`
	},

	INTEREST: {
		GET: `${config.server}/api/interest.get`,
		LIST: `${config.server}/api/interest.list`,
		SAVE: `${config.server}/api/interest.save`
	},

	USER_PROFILE: {
		GET: `${config.server}/api/userProfile.get`,
		LIST: `${config.server}/api/userProfile.list`,
		SAVE: `${config.server}/api/userProfile.save`
	},

	CHANNEL: {
		GET: `${config.server}/api/channel.get`,
		LIST: `${config.server}/api/channel.list`,
		SAVE: `${config.server}/api/channel.save`
	},

	MESSAGE: {
		GET: `${config.server}/api/message.get`,
		LIST: `${config.server}/api/message.list`,
		SAVE: `${config.server}/api/message.save`
	},

	TOKEN: {
		SAVE: `${config.server}/api/userProfile.token.save`
	},

	SEARCH: {
		GET: `${config.server}/api/search.get`
	},

	OTP: {
		SEND: `${config.server}/api/otp.send`
	},

	ACCOUNT: {
		// CREATE: `${config.server}/api/account.create`,
		GET_BY_PENDING_REQUEST_ID: `${config.server}/api/account.getByPendingRequestId`,
		LOG: `${config.server}/api/account.log`,
		GET: `${config.server}/api/account.get`,
		GET_BY_TOKEN: `${config.server}/api/account.getByToken`,
		SAVE: `${config.server}/api/account.save`,
		MAYBE_CREATE: `${config.server}/api/account.maybe.create`
	},

	PENDING_ACCOUNT: {
		CREATE: `${config.server}/api/account.maybe.create.v1`
	},

	PHOTO: {
		UPLOAD: `${config.server}/api/photo.upload`
	},

	RTM: {
		CONNECT: `${config.server}/rtm`
	},

	WORLD: {
		COUNTRY: `${config.server}/api/countries.list`,
		STATES: `${config.server}/api/states.get`,
		CITIES: `${config.server}/api/cities.get`
	},

	VIEWED_MY_PROFILE: {
		SAVE: `${config.server}/api/viewedMyProfile.save`,
		SEARCH: `${config.server}/api/viewedMyProfile.search`
	},

	VIEWED_MY_CONTACT: {
		GET: `${config.server}/api/viewedMyContact.get`,
		SAVE: `${config.server}/api/viewedMyContact.save`,
		SEARCH: `${config.server}/api/viewedMyContact.search`
	},

	ORDER: {
		CREATE: `${config.server}/api/order.create`,
		SUCCESS: `${config.server}/api/order.success`,
		ERROR: `${config.server}/api/order.error`
	},

	CE: {
		GET: `${config.server}/api/ce.get`
	},
	BLOCK: {
		REPORT: `${config.server}/api/block.report`,
		LIST: `${config.server}/api/block.list`,
		UNBLOCK: `${config.server}/api/unblock`
	},

	PAID_CONTACT: {
		GET: `${config.server}/api/paid.contact.get`
	}
};
