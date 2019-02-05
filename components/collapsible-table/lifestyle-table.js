import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class LifestyleTable extends React.Component {
	mappings = {
		diet: {
			label: 'Diet',
			type: 'string'
		},
		smoking: {
			label: 'Smoking',
			type: 'string'
		},
		drinking: {
			label: 'Drinking',
			type: 'string'
		},
		hoteling: {
			label: 'Hoteling',
			type: 'string'
		},
		partying: {
			label: 'Partying',
			type: 'string'
		},
		socialNetworking: {
			label: 'Social Networking',
			type: 'tag-array'
		},
		priorities: {
			label: 'Priorities',
			type: 'tag-array'
		},
		hobbies: {
			label: 'Hobbies',
			type: 'tag-array'
		},
		sports: {
			label: 'Sports and Fitness',
			type: 'tag-array'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="Personal Habits and Lifestyle"
				object={AccountFixture.lifestyle}
				mapping={this.mappings}
			/>
		);
	}
}
