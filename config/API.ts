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
		GET: `${config.server}/api/favourite.get`
	}
};
