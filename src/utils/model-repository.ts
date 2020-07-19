import { UserProfile, DAO } from '../store/reducers/account-defination';
import {
	setAccountRequestFromPendingAccount,
	removeAccountRequest,
	getAccountRequest
} from './account-request';

/**
 * Repository for new account creation
 */
export class ModelRepository {
	public userProfile: UserProfile;
	public userProfilePhoto: string | null;
	public phoneNumber: string | null;
	public createdOn: number | null;
	public expoToken: string | null;
	public id: string | null;

	setId(id: string) {
		this.id = id;
		return this;
	}

	setProfilePhoto(url: string) {
		this.userProfilePhoto = url;
		return this;
	}

	setPhoneNumber(phoneNumber: string) {
		this.phoneNumber = phoneNumber;
		return this;
	}

	setExpoToken(token: string) {
		this.expoToken = token;
		return this;
	}

	constructor() {
		this.id = null;
		this.expoToken = null;
		this.createdOn = null;
		this.userProfilePhoto = null;
		this.phoneNumber = null;
		const ts = new Date().getTime();
		const baseDao: DAO = {
			// id: 0, // id should be optional
			createdOn: ts,
			updatedOn: ts,
			deletedOn: ts
		};
		this.userProfile = {
			responseRate: 0,
			responseTime: 0,
			lastLogin: new Date().getTime(), // check what is the last login duiring init

			gender: '',
			about: '',
			createdBy: '',
			salutation: '',
			fullName: '',
			dob: 0,
			maritalStatus: '',
			height: 0,
			weight: 0,
			bodyType: '',
			bodyComplexion: '',
			lenses: '',
			bloodGroup: '',
			motherTongue: '',
			isFavourite: false,
			isBlocked: false,
			pushToken: '',

			specialCases: [],
			describeMyself: [],

			verification: {
				address: false,
				identity: false,
				income: false,
				...baseDao
			},
			education: {
				mediumOfPrimaryEducation: '',
				highestEducationLevel: '',
				educationField: '',
				education: '',
				additionalEducation: '',
				university: '',
				...baseDao
			},
			profession: {
				occupation: '',
				workingField: '',
				lengthOfEmployment: null,
				company: '',
				designation: '',
				currency: '',
				monthlyIncome: null,
				annualIncome: null,
				loans: [],
				otherLoans: '',
				workCountry: null,
				workState: null,
				workCity: null,
				...baseDao
			},
			horoscope: {
				caste: [],
				subCaste: [],
				birthPlace: '',
				birthTime: 0,
				rashi: '',
				nakshatra: '',
				charan: '',
				gan: '',
				nadi: '',
				mangal: '',
				gotra: '',
				wantToSeePatrika: false,
				...baseDao
			},
			investments: {
				home: [],
				realEstate: [],
				vehicle: [],
				investments: [],
				...baseDao
			},
			lifestyle: {
				diet: '',
				smoking: '',
				drinking: '',
				hoteling: '',
				partying: '',
				socialNetworking: [],
				priorities: [],
				hobbies: [],
				sports: [],
				...baseDao
			},
			otherDetails: {
				medicalHistory: '',
				currentMedications: '',
				passport: false,
				visaDetails: '',
				...baseDao
			},
			contactInformation: {
				phoneNumber: '',
				address: '',
				pinCode: '',
				residentialCity: '',
				mobileNumber1: '',
				mobileNumber1Of: '',
				mobileNumber2: '',
				mobileNumber2Of: '',
				landlineNumber: '',
				emailId: '',
				emailIdOf: '',
				alternateEmailId: '',
				alternateEmailIdOf: '',
				facebookLink: '',
				linkedinLink: '',
				...baseDao
			},
			userReference: {
				relativeName: '',
				relationWithMember: '',
				contactNumber: '',
				address: '',
				...baseDao
			},
			family: {
				fatherName: '',
				father: '',
				fatherOccupation: '',
				fatherDesignation: '',
				fatherNativePlace: '',
				motherName: '',
				mother: '',
				motherOccupation: '',
				motherDesignation: '',
				motherMaternalSurname: '',
				motherNativePlace: '',
				noOfBrothers: null,
				brothersMarried: null,
				noOfSisters: null,
				sistersMarried: null,
				aboutFamily: '',
				familyCountry: null,
				familyState: null,
				familyCity: null,
				interCasteParents: false,
				parentsLivingSeperately: false,
				familyOtherInformation: {
					familyValues: [],
					familyFinancialBackground: [],
					familyAnnualIncome: '',
					home: '',
					homeType: [],
					otherHomeType: [],
					realEstate: [],
					vehicle: false,
					vehicleType: [],
					loan: [],
					otherLoans: '',
					familyMedicalHistory: '',
					...baseDao
				},
				...baseDao
			},
			preference: {
				maritalStatus: '',
				caste: [],
				subCaste: [],
				differenceHeight: '',
				differenceAge: '',
				educationLevel: [],
				education: '',
				mediumOfEducation: '',
				workingPartner: '',
				occupation: '',
				workCountry: null,
				workState: null,
				workCity: null,
				parentCountry: null,
				parentState: null,
				parentCity: null,
				diet: '',
				smoke: '',
				drink: '',
				hoteling: '',
				partying: '',
				cooking: '',
				familyFinancialBackground: [],
				familyValues: [],
				specialCase: [],
				otherExpectations: '',
				hideProfileFrom: '',
				...baseDao
			},
			photo: [],
			...baseDao
		};
	}

	async save() {
		this.createdOn = new Date().getTime();
		setAccountRequestFromPendingAccount(this);
		return getAccountRequest();
	}

	delete() {
		removeAccountRequest();
	}

	load(model: ModelRepository) {
		Object.assign(this, model);
	}
}

export const modelRepository = new ModelRepository();
