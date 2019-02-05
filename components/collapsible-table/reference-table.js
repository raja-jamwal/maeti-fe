import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class ReferenceTable extends React.Component {
	mappings = {
		relativeName: {
			label: 'Relative Name',
			type: 'string'
		},
		relationWithMember: {
			label: 'Relation with the member',
			type: 'string'
		},
		contactNumber: {
			label: 'Contact Number',
			type: 'string'
		},
		address: {
			label: 'Address',
			type: 'string'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="References"
				object={AccountFixture.references}
				mapping={this.mappings}
			/>
		);
	}
}
