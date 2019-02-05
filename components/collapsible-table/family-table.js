import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';
import { View } from 'react-native';

export default class FamilyTable extends React.Component {
	mapping = {
		fatherName: {
			label: "Father's Name",
			type: 'string'
		},
		father: {
			label: 'Father',
			type: 'string'
		},
		fatherOccupation: {
			label: "Father's Occupation",
			type: 'string'
		},
		fatherDesignation: {
			label: "Father's Designation(Present/Last)",
			type: 'string'
		},
		fatherNativePlace: {
			label: "Father's Native Place",
			type: 'string'
		},
		motherName: {
			label: "Mother's Name",
			type: 'string'
		},
		mother: {
			label: 'Mother',
			type: 'string'
		},
		motherOccupation: {
			label: "Mothers's Occupation",
			type: 'string'
		},
		motherDesignation: {
			label: "Mothers's Designation(Present/Last)",
			type: 'string'
		},
		motherMaternalSurname: {
			label: "Mother's Maternal Surname",
			type: 'string'
		},
		motherNativePlace: {
			label: "Mother's Native Place",
			type: 'string'
		},
		noOfBrothers: {
			label: 'No. of Brother(s)',
			type: 'number'
		},
		brothersMarried: {
			label: 'Of which married',
			type: 'number'
		},
		noOfSisters: {
			label: 'No. of Sister(s)',
			type: 'number'
		},
		sistersMarried: {
			label: 'Of which married',
			type: 'number'
		},
		aboutFamily: {
			label: 'About Family',
			type: 'about'
		},
		familyLocation: {
			label: 'Families current location',
			type: 'string'
		},
		interCasteParents: {
			label: 'Inter caste marriage of Parents?',
			type: 'bool'
		},
		parentsLivingSeperately: {
			label: 'Parents living separately?',
			type: 'bool'
		}
	};

	otherInfoMapping = {
		familyValues: {
			label: 'Family Values',
			type: 'string'
		},
		familyFinancialBackground: {
			label: 'Family Financial Background',
			type: 'string'
		},
		familyAnnualIncome: {
			label: "Family's Annual Income",
			type: 'string'
		},
		home: {
			label: 'Home',
			type: 'string'
		},
		homeType: {
			label: 'Home Type',
			type: 'tag-array'
		},
		otherHomeType: {
			label: 'Other Home Type',
			type: 'tag-array'
		},
		realEstate: {
			label: 'Real Estate',
			type: 'tag-array'
		},
		vehicle: {
			label: 'Vehicle',
			type: 'bool'
		},
		vehicleType: {
			label: 'Vehicle Type',
			type: 'tag-array'
		},
		loans: {
			label: 'Loans',
			type: 'tag-array'
		},
		otherLoans: {
			label: 'Loans / Financial Liabilities',
			type: 'string'
		},
		familyMedialHistory: {
			label: "Family's Medical History",
			type: 'string'
		}
	};

	render() {
		return (
			<View>
				<CollapsibleTable
					title="Family Information"
					object={AccountFixture.family}
					mapping={this.mapping}
				/>
				<CollapsibleTable
					title="Other Information"
					object={AccountFixture.family.otherInformation}
					mapping={this.otherInfoMapping}
				/>
			</View>
		);
	}
}
