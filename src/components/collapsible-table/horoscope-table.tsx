import * as React from 'react';
import CollapsibleTable from './index';
import { Horoscope } from '../../store/reducers/account-defination';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updateHoroscope } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';
import { View } from 'react-native';
import { HoroscopeView } from '../horoscope-view/horoscope-view';
interface IHoroscopeTableProps {
	userProfileId: number;
	editable: boolean;
}

interface IHoroscopeTableMapStateToProps {
	horoscope?: Horoscope;
}

interface IHoroscopeTableMapDispatchToProps {
	updateHoroscope: () => any;
}

export const HoroscopeMapping = {
	caste: {
		label: 'Caste',
		tagType: 'caste',
		type: 'tag-array'
	},
	subCaste: {
		label: 'Sub Caste',
		tagType: 'sub_caste',
		type: 'tag-array'
	},
	birthTime: {
		label: 'Birth Time',
		type: 'date-time'
	},
	birthCity: {
		label: 'Birth City',
		type: 'city-only'
	},
	wantToSeePatrika: {
		label: 'Want to see patrika',
		type: 'choice',
		choice: {
			options: [
				{
					label: 'Yes',
					value: true
				},
				{
					label: 'No',
					value: false
				}
			]
		}
	}
};

class HoroscopeTable extends React.Component<
	IHoroscopeTableProps & IHoroscopeTableMapDispatchToProps & IHoroscopeTableMapStateToProps
> {
	render() {
		const { horoscope, userProfileId, updateHoroscope, editable } = this.props;
		if (!horoscope) return null;
		return (
			<View>
				<CollapsibleTable
					title="Horoscope and Religious information"
					object={horoscope}
					mapping={HoroscopeMapping}
					updateAction={updateHoroscope}
					userProfileId={userProfileId}
					editable={editable}
				/>
				<HoroscopeView />
			</View>
		);
	}
}

const mapStateToProps = (initialState: IRootState, ownProps: IHoroscopeTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
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
	IHoroscopeTableMapStateToProps,
	IHoroscopeTableMapDispatchToProps,
	IHoroscopeTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(HoroscopeTable);
