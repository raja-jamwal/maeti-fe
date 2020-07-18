import * as React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { EditableForm } from '../editable-form';
import GlobalStyle from 'src/styles/global';
import { getLogger } from '../../utils/logger';
import { modelRepository } from '../../utils/model-repository';
import { ProfileMapping } from '../../components/collapsible-table/profile-table';
import { EducationMapping } from '../collapsible-table/education-table';
import { ProfessionMapping } from '../collapsible-table/profession-table';
import { HoroscopeMapping } from '../collapsible-table/horoscope-table';
import { findIndex, nth, pick, keys, pickBy, includes, get, set, isEmpty, findKey } from 'lodash';
import { FamilyMapping } from '../collapsible-table/family-table';
import { simpleAlert } from '../alert/index';

const selectFields = (mapping: any, fields: any[]) => {
	const labels = fields.map(field => field.label);
	const whiteListedKeys = keys(pickBy(mapping, field => includes(labels, field.label)));
	return pick(mapping, whiteListedKeys);
};

const updateObjectCallback = (selectedMapping: any) => {
	const selectedMappingKeys = Object.keys(selectedMapping);
	return (updatedObject: any) =>
		pickBy(updatedObject, (field, key) => includes(selectedMappingKeys, key));
};

const basicWhitelistedFields = [
	ProfileMapping.gender,
	ProfileMapping.createdBy,
	ProfileMapping.salutation,
	ProfileMapping.fullName,
	ProfileMapping.maritalStatus,
	ProfileMapping.about,
	ProfileMapping.dob,
	ProfileMapping.height,
	ProfileMapping.weight,
	ProfileMapping.bodyType,
	ProfileMapping.bodyComplexion,
	ProfileMapping.lenses
];

const basicMapping = selectFields(
	Object.assign({}, ProfileMapping, {
		gender: { ...ProfileMapping.gender, isNotEditable: false }
	}),
	basicWhitelistedFields
);

const horoscopeMapping = selectFields(HoroscopeMapping, [
	HoroscopeMapping.caste,
	HoroscopeMapping.subCaste,
	HoroscopeMapping.birthPlace,
	HoroscopeMapping.birthTime,
	HoroscopeMapping.rashi
]);

const familyMapping = selectFields(FamilyMapping, [
	FamilyMapping.fatherName,
	FamilyMapping.father,
	FamilyMapping.fatherOccupation,
	FamilyMapping.fatherNativePlace,
	FamilyMapping.motherName,
	FamilyMapping.mother,
	FamilyMapping.motherOccupation,
	FamilyMapping.familyCountry,
	FamilyMapping.familyState,
	FamilyMapping.familyCity,
	FamilyMapping.interCasteParents,
	FamilyMapping.parentsLivingSeperately
]);

const validationCallback = (requiredMapping: any) => {
	const requiredMappingKeys = Object.keys(requiredMapping);
	return (updatedObject: any) => {
		const firstInvalidField = findKey(updatedObject, (value, fieldKey) => {
			// shim for 'fullName'
			if (fieldKey === 'fullName') {
				const nameSplitBySpace = (value || '').split(' ');
				if (nameSplitBySpace.length < 2) {
					return true;
				}
			}

			return includes(requiredMappingKeys, fieldKey) && !(!!value || !isEmpty(value));
		});
		if (!!firstInvalidField) {
			const field = requiredMapping[firstInvalidField];
			simpleAlert(`${field.label}`, `Please provide '${field.label}'`);
			return false;
		}
		return true;
	};
};

const FORM = {
	basic: {
		title: 'Basic Details',
		key: 'userProfile',
		object: modelRepository.userProfile,
		mapping: basicMapping,
		updateCallback: updateObjectCallback(basicMapping),
		validation: validationCallback(basicMapping)
	},
	education: {
		title: 'Education Information',
		key: 'userProfile.education',
		object: modelRepository.userProfile.education,
		mapping: EducationMapping,
		updateCallback: updateObjectCallback(EducationMapping),
		validation: validationCallback(
			selectFields(EducationMapping, [
				EducationMapping.mediumOfPrimaryEducation,
				EducationMapping.highestEducationLevel,
				EducationMapping.educationField,
				EducationMapping.university
			])
		)
	},
	profession: {
		title: 'Profession Information',
		key: 'userProfile.profession',
		object: modelRepository.userProfile.profession,
		mapping: ProfessionMapping,
		updateCallback: updateObjectCallback(ProfessionMapping),
		validation: validationCallback(
			selectFields(ProfessionMapping, [
				ProfessionMapping.occupation,
				ProfessionMapping.lengthOfEmployment,
				ProfessionMapping.annualIncome
				// ProfessionMapping.workCountry,
				// ProfessionMapping.workState,
				// ProfessionMapping.workCity
			])
		)
	},
	horoscope: {
		title: 'Horoscope Information',
		key: 'userProfile.horoscope',
		object: modelRepository.userProfile.horoscope,
		mapping: horoscopeMapping,
		updateCallback: updateObjectCallback(horoscopeMapping),
		validation: validationCallback(
			selectFields(horoscopeMapping, [
				// HoroscopeMapping.caste,
				// HoroscopeMapping.subCaste,
				HoroscopeMapping.birthPlace,
				HoroscopeMapping.birthTime,
				HoroscopeMapping.rashi
			])
		)
	},
	family: {
		title: 'Family  Information',
		key: 'userProfile.family',
		object: modelRepository.userProfile.family,
		mapping: familyMapping,
		updateCallback: updateObjectCallback(familyMapping),
		validation: validationCallback(
			selectFields(familyMapping, [
				FamilyMapping.fatherName,
				FamilyMapping.father,
				FamilyMapping.motherName,
				FamilyMapping.mother,
				FamilyMapping.interCasteParents,
				FamilyMapping.parentsLivingSeperately
			])
		)
	}
};

const FORM_PAGES = Object.keys(FORM);

const getObjectAndMapping = (page: string) => {
	const { key, mapping, title } = (FORM as any)[page];
	const object = get(modelRepository, key);
	return {
		object,
		mapping,
		title
	};
};

export const RegisterForm = ({ navigation }: NavigationInjectedProps) => {
	const logger = getLogger(RegisterForm);
	const formPage = navigation.getParam('formPage', null) || FORM_PAGES[0];
	let { object, mapping } = getObjectAndMapping(formPage ? formPage : FORM_PAGES[0]);
	const update = (updatedObject: any) => {
		const currentPageIndex = findIndex(FORM_PAGES, a => a === formPage);
		const pageKey = FORM_PAGES[currentPageIndex];
		const key = (FORM as any)[pageKey].key;
		const validationCallback = (FORM as any)[pageKey].validation;
		if (validationCallback) {
			const isValid = validationCallback(updatedObject);
			if (!isValid) return;
		}
		const updateCallback = (FORM as any)[pageKey].updateCallback;
		const existingValue = get(modelRepository, key);
		if (updateCallback) {
			set(modelRepository, key, {
				...existingValue,
				...updateCallback(updatedObject)
			});
		} else {
			set(modelRepository, key, {
				...existingValue,
				...updatedObject
			});
		}
		const nextPage = nth(FORM_PAGES, currentPageIndex + 1);
		if (!nextPage) {
			return navigation.push('UploadPhotoScreen');
		}
		navigation.push('FormScreen', {
			formPage: nextPage
		});
	};
	return (
		<SafeAreaView style={GlobalStyle.expand}>
			<EditableForm
				navObject={object}
				mapping={mapping}
				updateAction={update}
				updateLabel="Save"
			/>
		</SafeAreaView>
	);
};

RegisterForm['navigationOptions'] = ({ navigation }: any) => {
	const formPage = navigation.getParam('formPage', null) || FORM_PAGES[0];
	const { title } = getObjectAndMapping(formPage ? formPage : FORM_PAGES[0]);
	return {
		title
	};
};
