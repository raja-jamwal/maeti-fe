import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class ContactTable extends React.Component {
	mappings = {
		address: {
			label: 'Address',
			type: 'string'
		},
		pinCode: {
			label: 'Pin Code',
			type: 'string'
		},
		residentialCity: {
			label: 'Residential City',
			type: 'string'
		},
		mobileNumber1: {
			label: 'Mobile Number 1',
			type: 'string'
		},
		mobileNumberOf1: {
			label: 'Mobile Number 1 Of',
			type: 'string'
		},
		mobileNumber2: {
			label: 'Mobile Number 2',
			type: 'string'
		},
		mobileNumberOf2: {
			label: 'Mobile Number 2 Of',
			type: 'string'
		},
		landlineNumber: {
			label: 'Landline Number',
			type: 'string'
		},
		emailId: {
			label: 'Email ID',
			type: 'string'
		},
		emailIdOf: {
			label: 'Email ID Of',
			type: 'string'
		},
		alternateEmailId: {
			label: 'Alternate Email ID',
			type: 'string'
		},
		alternateEmailIdOf: {
			label: 'Alternate Email ID Of',
			type: 'string'
		},
		facebookLink: {
			label: 'Facebook Link',
			type: 'string'
		},
		linkedinLink: {
			label: 'LinkedIn Link',
			type: 'string'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="Contact Information"
				object={AccountFixture.contactInformation}
				mapping={this.mappings}
			/>
		);
	}
}
