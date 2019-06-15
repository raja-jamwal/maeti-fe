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
		maritalStatus: {
			label: 'Marital Status',
			type: 'string'
		},
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
		differenceHeight: {
			label: 'Height',
			type: 'string'
		},
		differenceAge: {
			label: 'Difference in Age',
			type: 'string'
		},
		educationLevel: {
			label: 'Education Level',
			tagType: 'education_level',
			type: 'tag-array'
		},
		education: {
			label: 'Education',
			type: 'string'
		},
		mediumOfEducation: {
			label: 'Medium of Primary Education',
			type: 'string'
		},
		workingPartner: {
			label: 'Do you want a working partner',
			type: 'string'
		},
		occupation: {
			label: 'Occupation',
			type: 'string'
		},
		workCountry: {
			label: 'Work Location Country',
			type: 'string'
		},
		workState: {
			label: 'Work Location State',
			type: 'string'
		},
		workCity: {
			label: 'Work Location City',
			type: 'string'
		},
		parentCounty: {
			label: 'Parent State Location',
			type: 'string'
		},
		parentCity: {
			label: 'Parent City Location',
			type: 'string'
		},
		diet: {
			label: 'Diet',
			type: 'string'
		},
		smoke: {
			label: 'Smoke',
			type: 'choice',
			choice: {
				options: [
					{
						label: 'Not Set',
						value: null
					},
					{
						label: 'Yes',
						value: 'yes'
					},
					{
						label: 'No',
						value: 'no'
					},
					{
						label: 'Occasionally',
						value: 'occasionally'
					},
					{
						label: 'Any',
						value: 'any'
					}
				]
			}
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
		familyFinancialBackground: {
			label: 'Family Financial Background',
			tagType: 'financial_background',
			type: 'tag-array'
		},
		familyValues: {
			label: 'Family Values',
			tagType: 'family_value',
			type: 'tag-array'
		},
		specialCase: {
			label: 'Special Case',
			tagType: 'case',
			type: 'tag-array'
		},
		otherExpectations: {
			label: 'Other Expectations',
			type: 'string'
		},
		// we need to visit this again
		hideProfileFrom: {
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
