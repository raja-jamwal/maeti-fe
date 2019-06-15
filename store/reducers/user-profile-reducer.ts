import {
	ContactInformation,
	DAO,
	Education,
	Family,
	FamilyOtherInformation,
	Horoscope,
	Investments,
	Lifestyle,
	Preference,
	Profession,
	UserProfile,
	UserReference,
	Verification
} from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { IRootState } from '../index';
import { API } from '../../config/API';
import { Dispatch } from 'redux';

export interface IUserProfileState {
	[id: number]: UserProfile;
}

const defaultProfileState: IUserProfileState = {};

const ADD_PROFILE = 'ADD_PROFILE';
export const addProfile = createAction<UserProfile>(ADD_PROFILE);

/*const UPDATE_VERIFICATION = 'UPDATE_VERIFICATION';
interface IUpdateVerificationPayload {
	userProfileId: number;
	object: Verification;
}

export const updateVerification = createAction<IUpdateVerificationPayload>(UPDATE_VERIFICATION);*/

interface IUpdateEnityPayload {
	userProfileId: number;
	object: any;
}

const patchEntity = (entityUrl: string, object: any, entityId?: number) => {
	const url = entityId ? `${entityUrl}/${entityId}` : entityUrl;
	const method = entityId ? 'PATCH' : 'POST';
	return fetch(url, {
		method: method,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(object)
	})
		.then(response => {
			if (response.status !== 200) {
				throw response.json();
			}
			return response;
		})
		.then(response => response.json())
		.catch(err => console.log('err ', err));
};

const updateLocalAndServer = function<T extends DAO>(
	userProfileId: number,
	entity: T,
	entityUrl: string,
	getUpdatedProfile: (userProfile: UserProfile, entity: T) => UserProfile,
	direct?: boolean
) {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		if (!userProfileId) return null;
		const entityId = direct ? undefined : entity.id;
		return patchEntity(entityUrl, entity, entityId)
			.then((updatedServerEntity: T) => {
				const userProfile = getState().userProfiles[userProfileId];
				const clonedProfile = { ...userProfile };
				const updatedUserProfile = getUpdatedProfile(clonedProfile, updatedServerEntity);
				dispatch(addProfile({ ...updatedUserProfile }));
				return updatedUserProfile;
			})
			.catch(err => console.log('err ', err));
	};
};

export const updateVerification = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, verification: Verification) => {
		userProfile.verification = verification;
		return userProfile;
	};
	return updateLocalAndServer<Verification>(userProfileId, object, API.VERIFICATIONS, updateFunc);
};

export const updateUserProfile = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, newUserProfile: UserProfile) => newUserProfile;
	return updateLocalAndServer<UserProfile>(
		userProfileId,
		object,
		API.USER_PROFILE_SAVE,
		updateFunc,
		true
	);

	/*return (dispatch: Dispatch<any>) => {
		return fetch(API.USER_PROFILE_SAVE, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(object)
		}).then(response => {
			if (response.status !== 200) {
				throw response.json();
			}
			return response;
		})
			.then(response => response.json())
			.then(userProfile => {
				dispatch(addProfile({...object}))
			})
			.catch(err => console.log('err ', err))
	};*/
};

export const updateEducation = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, education: Education) => {
		userProfile.education = education;
		return userProfile;
	};
	return updateLocalAndServer<Education>(userProfileId, object, API.EDUCATIONS, updateFunc);
};

export const updateProfession = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, profession: Profession) => {
		userProfile.profession = profession;
		return userProfile;
	};
	return updateLocalAndServer<Profession>(
		userProfileId,
		object,
		API.PROFESSION_SAVE,
		updateFunc,
		true
	);
};

export const updateHoroscope = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, horoscope: Horoscope) => {
		userProfile.horoscope = horoscope;
		return userProfile;
	};
	return updateLocalAndServer<Horoscope>(userProfileId, object, API.HOROSCOPES, updateFunc);
};

export const updateInvestment = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, investments: Investments) => {
		userProfile.investments = investments;
		return userProfile;
	};
	return updateLocalAndServer<Investments>(
		userProfileId,
		object,
		API.INVESTMENT_SAVE,
		updateFunc,
		true
	);
};

export const updateLifestyle = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, lifestyle: Lifestyle) => {
		userProfile.lifestyle = lifestyle;
		return userProfile;
	};
	return updateLocalAndServer<Lifestyle>(
		userProfileId,
		object,
		API.LIFESTYLE_SAVE,
		updateFunc,
		true
	);
};

export const updateContactInformation = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, contactInformation: ContactInformation) => {
		// console.log('contactInfo ', contactInformation);
		userProfile.contactInformation = contactInformation;
		return userProfile;
	};
	return updateLocalAndServer<ContactInformation>(
		userProfileId,
		object,
		API.CONTACT_INFORMATIONS,
		updateFunc
	);
};

export const updateUserReference = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, userReference: UserReference) => {
		userProfile.userReference = userReference;
		return userProfile;
	};
	return updateLocalAndServer<UserReference>(
		userProfileId,
		object,
		API.USER_REFERENCES,
		updateFunc
	);
};

export const updateFamily = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, family: Family) => {
		userProfile.family = family;
		return userProfile;
	};
	return updateLocalAndServer<Family>(userProfileId, object, API.FAMILIES, updateFunc);
};

export const updateFamilyOtherInformation = function({
	userProfileId,
	object
}: IUpdateEnityPayload) {
	const updateFunc = (
		userProfile: UserProfile,
		familyOtherInformation: FamilyOtherInformation
	) => {
		userProfile.family = { ...userProfile.family };
		userProfile.family.familyOtherInformation = familyOtherInformation;
		return userProfile;
	};
	return updateLocalAndServer<FamilyOtherInformation>(
		userProfileId,
		object,
		API.FAMILY_OTHER_INFORMATION_SAVE,
		updateFunc,
		true
	);
};

export const updatePreference = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, preference: Preference) => {
		userProfile.preference = preference;
		return userProfile;
	};
	return updateLocalAndServer<Preference>(
		userProfileId,
		object,
		API.PREFERENCE_SAVE,
		updateFunc,
		true
	);
};

export const userProfileReducer = handleActions<IUserProfileState>(
	{
		[ADD_PROFILE]: (state, { payload }) => {
			const profile = (payload as any) as UserProfile;
			// console.log('adding or updating new profile', profile);
			return { ...state, [profile.id]: profile };
		}
		// [UPDATE_VERIFICATION]: (state, { payload }) => state
	},
	defaultProfileState
);
