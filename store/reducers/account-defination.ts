/***
 * Type definition for the account & sub entities
 *
 * TODO: harden string types to enums as and when needed
 */

export interface DAO {
	id: number;
	created_on: number;
	updated_on: number;
	deleted_on: number;
}

export interface Account extends DAO {
	payment: Payment;
	user_profile: UserProfile;
	country_code: string;
	phone_number: string;
	token: string;
}

export interface Payment extends DAO {
	selected_package: string;
	registration_date: number;
	expiry_date: number;
	receipt_number: string;
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

	response_rate: number;
	response_time: number;
	last_login: number;

	gender: string;
	about: string;
	created_by: string;
	salutation: string;
	full_name: string;
	dob: number;
	marital_status: string;
	height: number;
	weight: number;
	body_type: string;
	body_complexion: string;
	blood_group: string;
	mother_tongue: string;
	special_cases: Array<Tag>;
	describe_myself: Array<Tag>;

	verification: Verification;
	education: Education;
	profession: Profession;
	horoscope: Horoscope;
	investments: Investments;
	lifestyle: Lifestyle;
	other_details: OtherDetails;
	contact_information: ContactInformation;
	user_reference: UserReference;
	family: Family;
	preference: Preference;
	photos: PhotosEntity[];
}

export interface Education extends DAO {
	medium_of_primary_education: string;
	highest_education_level: string;
	education_field: string;
	education: string;
	additional_education: string;
	university: string;
}

export interface Profession extends DAO {
	occupation: string;
	working_field: string;
	length_of_employment: number;
	company: string;
	designation: string;
	currency: string;
	monthly_income: number;
	annual_income: number;
	loans: Array<Tag>;
	other_loans: string;
	work_city: string;
}

export interface Horoscope extends DAO {
	caste: string;
	sub_caste: string;
	birth_place: string;
	birth_time: number;
	rashi: string;
	nakshatra: string;
	charan: string;
	gan: string;
	nadi: string;
	mangal: string;
	gotra: string;
	want_to_see_patrika: boolean;
}

export interface Investments extends DAO {
	home: string;
	real_estate: string;
	vehicle: string;
	investments: Array<Tag>;
}

export interface Lifestyle extends DAO {
	diet: string;
	smoking: string;
	drinking: string;
	hoteling: string;
	partying: string;
	social_networking: Array<Tag>;
	priorities: Array<Tag>;
	hobbies: Array<Tag>;
	sports: Array<Tag>;
}

export interface OtherDetails extends DAO {
	medical_history: string;
	current_medications: string;
	passport: boolean;
	visa_details: string;
}

export interface ContactInformation extends DAO {
	address: string;
	pin_code: string;
	residential_city: string;
	mobile_number_1: string;
	mobile_number_1_of: string;
	mobile_number_2: string;
	mobile_number_2_of: string;
	landline_number: string;
	email_id: string;
	email_id_of: string;
	alternate_email_id: string;
	alternate_email_id_of: string;
	facebook_link: string;
	linkedin_link: string;
}

export interface UserReference extends DAO {
	relative_name: string;
	relation_with_member: string;
	contact_number: string;
	address: string;
}

export interface Family extends DAO {
	father_name: string;
	father: string;
	father_occupation: string;
	father_designation: string;
	father_native_place: string;
	mother_name: string;
	mother: string;
	mother_occupation: string;
	mother_designation: string;
	mother_maternal_surname: string;
	mother_native_place: string;
	no_of_brothers: number;
	brothers_married: number;
	no_of_sisters: number;
	sisters_married: number;
	about_family: string;
	family_location: string;
	inter_caste_parents: boolean;
	parents_living_seperately: boolean;
	family_other_information: FamilyOtherInformation;
}

export interface FamilyOtherInformation extends DAO {
	family_values: string;
	family_financial_background: string;
	family_annual_income: string;
	home: string;
	home_type: Array<Tag>;
	other_home_type: Array<Tag>;
	real_estate: Array<Tag>;
	vehicle: boolean;
	vehicle_type: Array<Tag>;
	loans: Array<Tag>;
	other_loans: string;
	family_medial_history: string;
}

export interface Preference extends DAO {
	marital_status: string;
	caste: Array<Tag>;
	sub_caste: Array<Tag>;
	difference_height: string;
	difference_age: string;
	education_level: Array<Tag>;
	education: string;
	medium_of_education: string;
	working_partner: string;
	occupation: string;
	work_country: string;
	work_state: string;
	work_city: string;
	parent_county: string;
	parent_city: string;
	diet: string;
	smoke: string;
	drink: string;
	hoteling: string;
	partying: string;
	cooking: string;
	family_financial_background: Array<Tag>;
	family_values: Array<Tag>;
	special_case: Array<Tag>;
	other_expectations: string;
	hide_profile_from: string;
}

export interface PhotosEntity extends DAO {
	url: string;
}
