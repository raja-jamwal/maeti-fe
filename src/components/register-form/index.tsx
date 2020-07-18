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
import { findIndex, nth, pick, keys, pickBy, includes, get, set } from 'lodash';
import { FamilyMapping } from '../collapsible-table/family-table';

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

const FORM = {
	basic: {
		title: 'Basic Details',
		key: 'userProfile',
		object: modelRepository.userProfile,
		mapping: basicMapping,
		updateCallback: updateObjectCallback(basicMapping)
	},
	education: {
		title: 'Education Information',
		key: 'userProfile.education',
		object: modelRepository.userProfile.education,
		mapping: EducationMapping,
		updateCallback: updateObjectCallback(EducationMapping)
	},
	profession: {
		title: 'Profession Information',
		key: 'userProfile.profession',
		object: modelRepository.userProfile.profession,
		mapping: ProfessionMapping,
		updateCallback: updateObjectCallback(ProfessionMapping)
	},
	horoscope: {
		title: 'Horoscope Information',
		key: 'userProfile.horoscope',
		object: modelRepository.userProfile.horoscope,
		mapping: horoscopeMapping,
		updateCallback: updateObjectCallback(horoscopeMapping)
	},
	family: {
		title: 'Family  Information',
		key: 'userProfile.family',
		object: modelRepository.userProfile.family,
		mapping: familyMapping,
		updateCallback: updateObjectCallback(familyMapping)
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
