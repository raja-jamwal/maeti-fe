import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class VerificationTable extends React.Component {
	mappings = {
		address: {
			label: 'Address Verified',
			type: 'bool'
		},
		identity: {
			label: 'Identity Verified',
			type: 'bool'
		},
		income: {
			label: 'Income Verified',
			type: 'bool'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="Verification Information"
				object={AccountFixture.verification}
				mapping={this.mappings}
			/>
		);
	}
}
