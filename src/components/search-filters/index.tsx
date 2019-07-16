import { Text, View } from 'react-native';
import * as React from 'react';
import ChoiceFilter from './filters/ChoiceFilter';
import {
	BloodGroupOptions,
	BodyComplexionOptions,
	CreatedByOptions,
	MaritalStatusOptions
} from '../collapsible-table/profile-table';

interface FilterProps {
	options: any;
}

const Filter = (props: FilterProps) => {
	return (
		<View>
			<Text>Filter Not Implemented</Text>
		</View>
	);
};

export interface FilterOption {
	label: String;
	choices?: any;
	component: any;
	getSearchFilter?: (userSelections: any) => any;
}

interface ITypesOfFilter {
	[key: string]: FilterOption;
}

export const TypesOfFilter: ITypesOfFilter = {
	martialStatus: {
		label: 'Marital Status',
		choices: MaritalStatusOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			// check if not-set is set
			// then?
			const queryBase = {
				bool: {
					should: Object.keys(userSelections)
						.filter(u => !!userSelections[u])
						.map(maritalKey => {
							return {
								term: {
									maritalStatus: maritalKey
								}
							};
						})
				}
			};
			return queryBase;
		}
	},
	createdBy: {
		label: 'Created by',
		choices: CreatedByOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			// check if not-set is set
			// then?
			const queryBase = {
				terms: {
					createdBy: Object.keys(userSelections).filter(u => !!userSelections[u])
				}
			};
			return queryBase;
		}
	},
	age: {
		label: 'Age',
		component: Filter
	},
	height: {
		label: 'Height',
		component: Filter
	},
	caste: {
		label: 'Caste',
		component: Filter
	},
	'sub-caste': {
		label: 'Sub-Caste',
		component: Filter
	},
	country: {
		label: 'Country',
		component: Filter
	},
	state: {
		label: 'State',
		component: Filter
	},
	city: {
		label: 'City',
		component: Filter
	},
	occupation: {
		label: 'Occupation',
		component: Filter
	},
	income: {
		label: 'Income',
		component: Filter
	},
	education: {
		label: 'Education',
		component: Filter
	},
	'education-field': {
		label: 'Education Field',
		component: Filter
	},
	'education-medium': {
		label: 'Education Medium',
		component: Filter
	},
	'personal-values': {
		label: 'Personal Values',
		component: Filter
	},
	diet: {
		label: 'Diet',
		component: Filter
	},
	smoke: {
		label: 'Smoke',
		component: Filter
	},
	'blood-group': {
		label: 'Blood Group',
		choices: BloodGroupOptions,
		component: ChoiceFilter
	},
	lenses: {
		label: 'Spect/Lenses',
		component: Filter
	},
	complexion: {
		label: 'Complexion',
		choices: BodyComplexionOptions,
		component: ChoiceFilter
	},
	mangal: {
		label: 'Mangal',
		component: Filter
	},
	rashi: {
		label: 'Rashi',
		component: Filter
	},
	nadi: {
		label: 'Nadi',
		component: Filter
	},
	'sort-by': {
		label: 'Sort By',
		component: Filter
	}
};
