import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { Preference } from '../../store/reducers/account-defination';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updatePreference } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';

interface IPreferenceTableProps {
	userProfileId: number;
}
interface IPreferenceTableStateToProps {
	preference?: Preference;
}
interface IPreferenceTableMapDispatchToProps {
	updatePreference: () => any;
}

class PreferenceTable extends React.Component<
	IPreferenceTableProps,
	IPreferenceTableMapDispatchToProps,
	IPreferenceTableStateToProps
> {
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
			type: 'choice',
			choice: {
				options: [
					{
						label: 'Not Set',
						value: null
					},
					{
						label: 'Any',
						value: 'any'
					},
					{
						label: 'English',
						value: 'english'
					},
					{
						label: 'Gujrati',
						value: 'gujrati'
					},
					{
						label: 'Hindi',
						value: 'hindi'
					},
					{
						label: 'Kannada',
						value: 'kannada'
					},
					{
						label: 'Marathi',
						value: 'marathi'
					},
					{
						label: 'Marathi+English',
						value: 'mara_eng'
					},
					{
						label: 'Other',
						value: 'other'
					}
				]
			}
		},
		workingPartner: {
			label: 'Do you want a working partner',
			type: 'choice',
			choice: {
				options: [
					{
						label: 'Not Set',
						value: null
					},
					{
						label: 'Must',
						value: 'must'
					},
					{
						label: 'Preferred',
						value: 'preferred'
					},
					{
						label: 'No',
						value: 'no'
					},
					{
						label: 'Any',
						value: 'any'
					}
				]
			}
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
			type: 'choice',
			choice: {
				options: [
					{
						label: 'Not Set',
						value: null
					},
					{
						label: 'Veg',
						value: 'veg'
					},
					{
						label: 'Non-Veg Frequently',
						value: 'non-veg-freq'
					},
					{
						label: 'Eggetarian',
						value: 'eggetarian'
					},
					{
						label: 'Non-Veg Occasionally',
						value: 'non-veg-occa'
					},
					{
						label: 'Others (Jain, Vegan)',
						value: 'others'
					},
					{
						label: 'Any',
						value: 'any'
					}
				]
			}
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
		hoteling: {
			label: 'Hoteling',
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
		partying: {
			label: 'Partying / Pubbing',
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
		cooking: {
			label: 'Cooking',
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

const mapStateToProps = (intialState: IRootState, ownProps: IPreferenceTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = intialState.userProfiles[profileId];
	if (profile) {
		const preference = profile.preference;
		return {
			preference
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updatePreference: bindActionCreators<Action<any>, any>(updatePreference, dispatch)
	};
};

export default connect<
	IPreferenceTableStateToProps,
	IPreferenceTableMapDispatchToProps,
	IPreferenceTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(PreferenceTable);
