import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { EditableForm } from '../editable-form';
import GlobalStyle from 'src/styles/global';
import { getLogger } from '../../utils/logger';
import { modelRepository } from '../../utils/model-repository';
import { ProfileMapping } from '../../components/collapsible-table/profile-table';
import { EducationMapping } from '../collapsible-table/education-table';
import { ProfessionMapping } from '../collapsible-table/profession-table';
import { HoroscopeMapping } from '../collapsible-table/horoscope-table';
import { findIndex, nth, pick, keys, pickBy, includes } from 'lodash';
import { FamilyMapping } from '../collapsible-table/family-table';

const selectFields = (mapping: any, fields: any[]) => {
	const labels = fields.map(field => field.label);
	const whiteListedKeys = keys(pickBy(mapping, field => includes(labels, field.label)));
	return pick(mapping, whiteListedKeys);
};

const FORM = {
	basic: {
		title: 'Basic Details',
		object: modelRepository.userProfile,
		mapping: selectFields(
			Object.assign({}, ProfileMapping, {
				gender: { ...ProfileMapping.gender, isNotEditable: false }
			}),
			[
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
			]
		)
	},
	education: {
		title: 'Education Information',
		object: modelRepository.userProfile.education,
		mapping: EducationMapping
	},
	profession: {
		title: 'Profession Information',
		object: modelRepository.userProfile.profession,
		mapping: ProfessionMapping
	},
	horoscope: {
		title: 'Horoscope Information',
		object: modelRepository.userProfile.horoscope,
		mapping: selectFields(HoroscopeMapping, [
			HoroscopeMapping.caste,
			HoroscopeMapping.subCaste,
			HoroscopeMapping.birthPlace,
			HoroscopeMapping.birthTime,
			HoroscopeMapping.rashi
		])
	},
	family: {
		title: 'Family  Information',
		object: modelRepository.userProfile.family,
		mapping: selectFields(FamilyMapping, [
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
		])
	}
};

const FORM_PAGES = Object.keys(FORM);

const getObjectAndMapping = (page: string) => {
	const { object, mapping, title } = (FORM as any)[page];
	return {
		object,
		mapping,
		title
	};
};

export function RegisterForm({ navigation }: NavigationInjectedProps) {
	const logger = getLogger(RegisterForm);
	const formPage = navigation.getParam('formPage', null) || FORM_PAGES[0];
	const { object, mapping } = getObjectAndMapping(formPage ? formPage : FORM_PAGES[0]);
	React.useEffect(() => {
		// navigation.
		// setTimeout(() => navigation.setParams({ title: title }), 1 * 1000);
		// navigation.setParams({ title:  });
	}, []);
	const update = (updatedObject: any) => {
		const currentPageIndex = findIndex(FORM_PAGES, a => a === formPage);
		const pageKey = FORM_PAGES[currentPageIndex];
		(FORM as any)[pageKey].object = updatedObject;
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
				updateLabel="Continue"
			/>
		</SafeAreaView>
	);
}

RegisterForm['navigationOptions'] = ({ navigation }: any) => {
	const formPage = navigation.getParam('formPage', null) || FORM_PAGES[0];
	const { title } = getObjectAndMapping(formPage ? formPage : FORM_PAGES[0]);
	return {
		title
	};
};
