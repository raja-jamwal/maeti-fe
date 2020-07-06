import * as React from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { defaultNavigationOptions } from './common';
import { NavigationInjectedProps } from 'react-navigation';
import { EditableForm } from '../components/editable-form';
import GlobalStyle from 'src/styles/global';
import { findIndex, nth } from 'lodash';
import { getLogger } from '../utils/logger';

const FORM = {
	basic: {
		title: 'Basic Details',
		object: {},
		mapping: {}
	},
	another: {
		title: 'Another Basic Details',
		object: {},
		mapping: {}
	}
};

const FORM_PAGES = Object.keys(FORM);

function RegisterForm({ navigation }: NavigationInjectedProps) {
	const logger = getLogger(RegisterForm);
	const getObjectAndMapping = (page: string) => {
		const { object, mapping, title } = (FORM as any)[page];
		return {
			object,
			mapping,
			title
		};
	};
	const formPage = navigation.getParam('formPage', null) || FORM_PAGES[0];
	const { object, mapping, title } = getObjectAndMapping(formPage ? formPage : FORM_PAGES[0]);
	React.useEffect(() => {
		// navigation.
		logger.log('called with ', title);
		setTimeout(() => navigation.setParams({ title: title }), 1 * 1000);
		// navigation.setParams({ title: title });
	}, []);
	const update = () => {
		const currentPageIndex = findIndex(FORM_PAGES, formPage);
		const nextPage = nth(FORM_PAGES, currentPageIndex + 1);
		if (!nextPage) return;
		navigation.push('Form', {
			formPage: nextPage,
			title: 'another one'
		});
	};
	return (
		<View style={GlobalStyle.expand}>
			<EditableForm navObject={object} mapping={mapping} updateAction={update} />
		</View>
	);
}

RegisterForm['navigationOptions'] = (props: any) => {
	return {
		title: 'Hello world'
	};
};

export const SignUpStack = createStackNavigator(
	{
		Form: RegisterForm
	},
	{ defaultNavigationOptions }
);
