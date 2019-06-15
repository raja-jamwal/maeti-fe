/***
 * Type definition for the account & sub entities
 *
 * TODO: harden string types to enums as and when needed
 */

export interface DAO {
	id: number;
	createdOn: number;
	updatedOn: number;
	deletedOn: number;
}

export interface Account extends DAO {
	payment: Payment;
	userProfile: UserProfile;
	countryCode: string;
	phoneNumber: string;
	token: string;
}

export interface Payment extends DAO {
	selectedPackage: string;
	registrationDate: number;
	expiryDate: number;
	receiptNumber: string;
}

export interface Verification extends DAO {
	address: boolean;
	identity: boolean;
	income: boolean;
}

export interface Tag extends DAO {
	tagId: string;
	value: string;
	tagType: string;
}

export interface UserProfile extends DAO {
	responseRate: number;
	responseTime: number;
	lastLogin: number;

	gender: string;
	about: string;
	createdBy: string;
	salutation: string;
	fullName: string;
	dob: number;
	maritalStatus: string;
	height: number;
	weight: number;
	bodyType: string;
	bodyComplexion: string;
	bloodGroup: string;
	motherTongue: string;
	specialCases: Array<Tag>;
	describeMyself: Array<Tag>;

	verification: Verification;
	education: Education;
	profession: Profession;
	horoscope: Horoscope;
	investments: Investments;
	lifestyle: Lifestyle;
	otherDetails: OtherDetails;
	contactInformation: ContactInformation;
	userReference: UserReference;
	family: Family;
	preference: Preference;
	photos: PhotosEntity[];
}

export interface Education extends DAO {
	mediumOfPrimaryEducation: string;
	highestEducationLevel: string;
	educationField: string;
	education: string;
	additionalEducation: string;
	university: string;
}

export interface Profession extends DAO {
	occupation: string;
	workingField: string;
	lengthOfEmployment: number;
	company: string;
	designation: string;
	currency: string;
	monthlyIncome: number;
	annualIncome: number;
	loans: Array<Tag>;
	otherLoans: string;
	workCity: string;
}

export interface Horoscope extends DAO {
	caste: string;
	subCaste: string;
	birthPlace: string;
	birthTime: number;
	rashi: string;
	nakshatra: string;
	charan: string;
	gan: string;
	nadi: string;
	mangal: string;
	gotra: string;
	wantToSeePatrika: boolean;
}

export interface Investments extends DAO {
	home: string;
	realEstate: string;
	vehicle: string;
	investments: Array<Tag>;
}

export interface Lifestyle extends DAO {
	diet: string;
	smoking: string;
	drinking: string;
	hoteling: string;
	partying: string;
	socialNetworking: Array<Tag>;
	priorities: Array<Tag>;
	hobbies: Array<Tag>;
	sports: Array<Tag>;
}

export interface OtherDetails extends DAO {
	medicalHistory: string;
	currentMedications: string;
	passport: boolean;
	visaDetails: string;
}

export interface ContactInformation extends DAO {
	address: string;
	pin_code: string;
	residentialCity: string;
	mobileNumber1: string;
	mobileNumber1Of: string;
	mobileNumber2: string;
	mobileNumber2Of: string;
	landlineNumber: string;
	emailId: string;
	emailIdOf: string;
	alternateEmailId: string;
	alternateEmailIdOf: string;
	facebookLink: string;
	linkedinLink: string;
}

export interface UserReference extends DAO {
	relativeMame: string;
	relationWithMember: string;
	contactNumber: string;
	address: string;
}

export interface Family extends DAO {
	fatherName: string;
	father: string;
	fatherOccupation: string;
	fatherDesignation: string;
	fatherNativePlace: string;
	motherName: string;
	mother: string;
	motherOccupation: string;
	motherDesignation: string;
	motherMaternalSurname: string;
	motherNativePlace: string;
	noOfBrothers: number;
	brothersMarried: number;
	noOfSisters: number;
	sistersMarried: number;
	aboutFamily: string;
	familyLocation: string;
	interCasteParents: boolean;
	parentsLivingSeperately: boolean;
	familyOtherInformation: FamilyOtherInformation;
}

export interface FamilyOtherInformation extends DAO {
	familyValues: string;
	familyFinancialBackground: string;
	familyAnnualIncome: string;
	home: string;
	homeType: Array<Tag>;
	otherHomeType: Array<Tag>;
	realEstate: Array<Tag>;
	vehicle: boolean;
	vehicleType: Array<Tag>;
	loans: Array<Tag>;
	otherLoans: string;
	familyMedicalHistory: string;
}

export interface Preference extends DAO {
	maritalStatus: string;
	caste: Array<Tag>;
	subCaste: Array<Tag>;
	differenceHeight: string;
	differenceAge: string;
	educationLevel: Array<Tag>;
	education: string;
	mediumOfEducation: string;
	workingPartner: string;
	occupation: string;
	workCountry: string;
	workState: string;
	workCity: string;
	parentCounty: string;
	parentCity: string;
	diet: string;
	smoke: string;
	drink: string;
	hoteling: string;
	partying: string;
	cooking: string;
	familyFinancialBackground: Array<Tag>;
	familyValues: Array<Tag>;
	specialCase: Array<Tag>;
	otherExpectations: string;
	hideProfileFrom: string;
}

export interface PhotosEntity extends DAO {
	url: string;
}

export interface FavouriteIdentity {
	id: number;
	favouriteOfUser: number;
}

export interface Favourite extends DAO {
	favouriteIdentity: FavouriteIdentity;
	favouriteOfUserProfile: UserProfile;
	favouriteProfile: UserProfile;
}
