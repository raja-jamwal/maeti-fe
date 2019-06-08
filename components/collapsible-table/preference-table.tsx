import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { Preference } from '../../store/reducers/account-defination';
import { bindActionCreators, Dispatch } from 'redux';
import { updatePreference } from '../../store/reducers/user-profile-reducer';

interface IPreferenceTableProps {
	userProfileId: number;
	preference: Preference;
	updatePreference: () => any;
}

class PreferenceTable extends React.Component<IPreferenceTableProps> {
	mappings = {
		marital_status: {
			label: 'Marital Status',
			type: 'string'
		},
		caste: {
			label: 'Caste',
			tagType: 'caste',
			type: 'tag-array'
		},
		sub_caste: {
			label: 'Sub Caste',
			tagType: 'sub_caste',
			type: 'tag-array'
		},
		difference_height: {
			label: 'Height',
			type: 'string'
		},
		difference_age: {
			label: 'Difference in Age',
			type: 'string'
		},
		education_level: {
			label: 'Education Level',
			tagType: 'education_level',
			type: 'tag-array'
		},
		education: {
			label: 'Education',
			type: 'string'
		},
		medium_of_education: {
			label: 'Medium of Primary Education',
			type: 'string'
		},
		working_partner: {
			label: 'Do you want a working partner',
			type: 'string'
		},
		occupation: {
			label: 'Occupation',
			type: 'string'
		},
		work_country: {
			label: 'Work Location Country',
			type: 'string'
		},
		work_state: {
			label: 'Work Location State',
			type: 'string'
		},
		work_city: {
			label: 'Work Location City',
			type: 'string'
		},
		parent_county: {
			label: 'Parent State Location',
			type: 'string'
		},
		parent_city: {
			label: 'Parent City Location',
			type: 'string'
		},
		diet: {
			label: 'Diet',
			type: 'string'
		},
		smoke: {
			label: 'Smoke',
			type: 'string'
		},
		drink: {
			label: 'Drink',
			type: 'string'
		},
		hoteling: {
			label: 'Hoteling',
			type: 'string'
		},
		partying: {
			label: 'Partying / Pubbing',
			type: 'string'
		},
		cooking: {
			label: 'Cooking',
			type: 'string'
		},
		family_financial_background: {
			label: 'Family Financial Background',
			tagType: 'financial_background',
			type: 'tag-array'
		},
		family_values: {
			label: 'Family Values',
			tagType: 'family_value',
			type: 'tag-array'
		},
		special_case: {
			label: 'Special Case',
			tagType: 'case',
			type: 'tag-array'
		},
		other_expectations: {
			label: 'Other Expectations',
			type: 'string'
		},
		// we need to visit this again
		hide_profile_from: {
			label: 'Do not Show Profile to',
			type: 'string'
		}
	};

	render() {
		const { preference, userProfileId, updatePreference } = this.props;
		if (!preference) return null;
		return (
			<CollapsibleTable
				title="Partner Preferences"
				object={preference}
				mapping={this.mappings}
				updateAction={updatePreference}
				userProfileId={userProfileId}
			/>
		);
	}
}

const mapStateToProps = (state: IRootState, props: IPreferenceTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const preference = profile.preference;
		return {
			preference
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updatePreference: bindActionCreators(updatePreference, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(PreferenceTable);
