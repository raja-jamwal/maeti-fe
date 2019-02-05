import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class ExpectationsTable extends React.Component {
	mappings = {
		maritalStatus: {
			label: 'Marital Status',
			type: 'string'
		},
		caste: {
			label: 'Caste',
			type: 'tag-array'
		},
		subCaste: {
			label: 'Sub Caste',
			type: 'tag-array'
		},
		differenceHeight: {
			label: 'Height',
			type: 'string'
		},
		differenceAge: {
			label: 'Difference in Age',
			type: 'string'
		},
		educationLevel: {
			label: 'Education Level',
			type: 'tag-array'
		},
		education: {
			label: 'Education',
			type: 'string'
		},
		mediumOfEducation: {
			label: 'Medium of Primary Education',
			type: 'string'
		},
		workingPartner: {
			label: 'Do you want a working partner',
			type: 'string'
		},
		occupation: {
			label: 'Occupation',
			type: 'string'
		},
		workCountry: {
			label: 'Work Location Country',
			type: 'string'
		},
		workState: {
			label: 'Work Location State',
			type: 'string'
		},
		workCity: {
			label: 'Work Location City',
			type: 'string'
		},
		parentCounty: {
			label: 'Parent State Location',
			type: 'string'
		},
		parentCity: {
			label: 'Parent City Location',
			type: 'string'
		},
		diet: {
			label: 'Diet',
			type: 'string'
		},
		smoke: {
			label: 'Smoke',
			type: 'string'
		},
		drink: {
			label: 'Drink',
			type: 'string'
		},
		hoteling: {
			label: 'Hoteling',
			type: 'string'
		},
		partying: {
			label: 'Partying / Pubbing',
			type: 'string'
		},
		cooking: {
			label: 'Cooking',
			type: 'string'
		},
		familyFinancialBackground: {
			label: 'Family Financial Background',
			type: 'tag-array'
		},
		familyValues: {
			label: 'Family Values',
			type: 'tag-array'
		},
		specialCase: {
			label: 'Special Case',
			type: 'tag-array'
		},
		otherExpectations: {
			label: 'Other Expectations',
			type: 'string'
		},
		// we need to visit this again
		hideProfileFrom: {
			label: 'Do not Show Profile to',
			type: 'string'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="Partner Preferences"
				object={AccountFixture.preference}
				mapping={this.mappings}
			/>
		);
	}
}
