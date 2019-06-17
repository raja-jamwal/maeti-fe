import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { Horoscope } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updateHoroscope } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';

interface IHoroscopeTableProps {
	userProfileId: number;
}

interface IHoroscopeTableMapStateToProps {
	horoscope: Horoscope;
}

interface IHoroscopeTableMapDispatchToProps {
	updateHoroscope: () => any;
}

class HoroscopeTable extends React.Component<
	IHoroscopeTableProps & IHoroscopeTableMapDispatchToProps & IHoroscopeTableMapStateToProps
> {
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

const mapStateToProps = (intialState: IRootState, ownProps: IHoroscopeTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = intialState.userProfiles[profileId];
	if (profile) {
		const horoscope = profile.horoscope;
		return {
			horoscope
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateHoroscope: bindActionCreators<Action<any>, any>(updateHoroscope, dispatch)
	};
};

export default connect<
	IHoroscopeTableMapDispatchToProps,
	IHoroscopeTableMapStateToProps,
	IHoroscopeTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(HoroscopeTable);
