import { UserProfile, DAO } from '../store/reducers/account-defination';

/**
 * Repository for new account creation
 */
class ModelRepository {
	public userProfile: UserProfile;
	public userProfilePhoto: string | null;

	setProfilePhoto(url: string) {
		this.userProfilePhoto = url;
		return this;
	}

	constructor() {
		this.userProfilePhoto = null;
		const ts = new Date().getTime();
		const baseDao: DAO = {
			id: 0, // id should be optional
			createdOn: ts,
			updatedOn: ts,
			deletedOn: ts
		};
		this.userProfile = {
			responseRate: 0,
			responseTime: 0,
			lastLogin: new Date().getTime(), // check what is the last login duiring init

			gender: 'male',
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
				birthTime: 1,
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
				pin_code: '',
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
				relativeMame: '',
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
				noOfBrothers: 1,
				brothersMarried: 1,
				noOfSisters: 1,
				sistersMarried: 1,
				aboutFamily: 'about family',
				familyCountry: null,
				familyState: null,
				familyCity: null,
				interCasteParents: false,
				parentsLivingSeperately: false,
				familyOtherInformation: {
					familyValues: '',
					familyFinancialBackground: '',
					familyAnnualIncome: '',
					home: '',
					homeType: [],
					otherHomeType: [],
					realEstate: [],
					vehicle: false,
					vehicleType: [],
					loans: [],
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
}

export const modelRepository = new ModelRepository();
