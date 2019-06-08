import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { Horoscope } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { updateHoroscope } from '../../store/reducers/user-profile-reducer';

interface IHoroscopeTableProps {
	userProfileId: number;
	horoscope: Horoscope;
	updateHoroscope: () => any;
}

class HoroscopeTable extends React.Component<IHoroscopeTableProps> {
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
		want_to_see_patrika: {
			label: 'Want to see patrika',
			type: 'bool'
		}
	};

	render() {
		const { horoscope, userProfileId, updateHoroscope } = this.props;
		if (!horoscope) return null;
		return (
			<CollapsibleTable
				title="Horoscope and Religious information"
				object={horoscope}
				mapping={this.mappings}
				updateAction={updateHoroscope}
				userProfileId={userProfileId}
			/>
		);
	}
}

const mapStateToProps = (state: IRootState, props: IHoroscopeTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const horoscope = profile.horoscope;
		return {
			horoscope
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateHoroscope: bindActionCreators(updateHoroscope, dispatch)
	};
};

export default connect<any, any>(
	mapStateToProps,
	mapDispatchToProps
)(HoroscopeTable);
