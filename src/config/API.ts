import * as config from './config.json';

export const API = {
	ACCOUNTS: `${config.server}/api/accounts`,
	USER_PROFILES: `${config.server}/api/userProfiles`,
	USER_PROFILE_SAVE: `${config.server}/api/userProfile.save`,
	VERIFICATIONS: `${config.server}/api/verifications`,
	EDUCATIONS: `${config.server}/api/educations`,
	PROFESSIONS: `${config.server}/api/professions`,
	PROFESSION_SAVE: `${config.server}/api/profession.save`,
	HOROSCOPES: `${config.server}/api/horoscopes`,
	INVESTMENTS: `${config.server}/api/investments`,
	INVESTMENT_SAVE: `${config.server}/api/investment.save`,
	LIFESTYLES: `${config.server}/api/lifestyles`,
	LIFESTYLE_SAVE: `${config.server}/api/lifestyle.save`,
	CONTACT_INFORMATIONS: `${config.server}/api/contactInformations`,
	USER_REFERENCES: `${config.server}/api/userReferences`,
	FAMILIES: `${config.server}/api/families`,
	FAMILY_OTHER_INFORMATIONS: `${config.server}/api/familyOtherInformations`,
	FAMILY_OTHER_INFORMATION_SAVE: `${config.server}/api/familyOtherInformation.save`,
	PREFERENCES: `${config.server}/api/preferences`,
	PREFERENCE_SAVE: `${config.server}/api/preference.save`,
	TAGS: `${config.server}/api/tags`,

	FAVOURITE: {
		GET: `${config.server}/api/favourite.get`,
		LIST: `${config.server}/api/favourite.list`,
		SAVE: `${config.server}/api/favourite.save`
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
		CREATE: `${config.server}/api/account.create`
	}
};
