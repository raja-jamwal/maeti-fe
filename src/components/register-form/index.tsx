import * as React from 'react';
import { View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { EditableForm } from '../editable-form';
import GlobalStyle from 'src/styles/global';
import { findIndex, nth } from 'lodash';
import { getLogger } from '../../utils/logger';
import { modelRepository } from '../../utils/model-repository';
import { ProfileMapping } from '../../components/collapsible-table/profile-table';

const FORM = {
	basic: {
		title: 'Basic Details',
		object: modelRepository.userProfile,
		mapping: ProfileMapping
	},
	another: {
		title: 'Another Basic Details',
		object: {},
		mapping: {}
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
	const update = () => {
		const currentPageIndex = findIndex(FORM_PAGES, a => a === formPage);
		const nextPage = nth(FORM_PAGES, currentPageIndex + 1);
		if (!nextPage) return;
		navigation.push('FormScreen', {
			formPage: nextPage
		});
	};
	return (
		<View style={GlobalStyle.expand}>
			<EditableForm
				navObject={object}
				mapping={mapping}
				updateAction={update}
				updateLabel="Continue"
			/>
		</View>
	);
}

RegisterForm['navigationOptions'] = ({ navigation }: any) => {
	const formPage = navigation.getParam('formPage', null) || FORM_PAGES[0];
	const { title } = getObjectAndMapping(formPage ? formPage : FORM_PAGES[0]);
	return {
		title
	};
};
