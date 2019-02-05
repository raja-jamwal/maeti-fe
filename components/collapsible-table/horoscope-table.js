import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class HoroscopeTable extends React.Component {
	mappings = {
		caste: {
			label: 'Caste',
			type: 'string'
		},
		subCaste: {
			label: 'Sub Caste',
			type: 'string'
		},
		birthPlace: {
			label: 'Birth Place',
			type: 'string'
		},
		birthTime: {
			label: 'Birth Time',
			type: 'time'
		},
		rashi: {
			label: 'Rashi',
			type: 'string'
		},
		nakshatra: {
			label: 'Nakshatra',
			type: 'string'
		},
		charan: {
			label: 'Charan',
			type: 'string'
		},
		gan: {
			label: 'Gan',
			type: 'string'
		},
		nadi: {
			label: 'Nadi',
			type: 'string'
		},
		mangal: {
			label: 'Mangal',
			type: 'string'
		},
		gotra: {
			label: 'Gotra',
			type: 'string'
		},
		wantToSeePatrika: {
			label: 'Want to see patrika',
			type: 'bool'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="Horoscope and Religious information"
				object={AccountFixture.horoscope}
				mapping={this.mappings}
			/>
		);
	}
}
