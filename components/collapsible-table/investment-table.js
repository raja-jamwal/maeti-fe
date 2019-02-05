import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class InvestmentTable extends React.Component {
	mappings = {
		home: {
			label: 'Home',
			type: 'string'
		},
		realEstate: {
			label: 'Real Estate',
			type: 'string'
		},
		vehicle: {
			label: 'Vehicle',
			type: 'string'
		},
		investments: {
			label: 'Investments',
			type: 'tag-array'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="Personal Investments"
				object={AccountFixture.investments}
				mapping={this.mappings}
			/>
		);
	}
}
