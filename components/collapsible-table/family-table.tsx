import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { View } from 'react-native';
import { Family } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
	updateFamily,
	updateFamilyOtherInformation
} from '../../store/reducers/user-profile-reducer';

interface IFamilyTableProps {
	userProfileId: number;
	family: Family;
	updateFamily: () => any;
	updateFamilyOtherInformation: () => any;
}

class FamilyTable extends React.Component<IFamilyTableProps> {
	mapping = {
		father_name: {
			label: "Father's Name",
			type: 'string'
		},
		father: {
			label: 'Father',
			type: 'string'
		},
		father_occupation: {
			label: "Father's Occupation",
			type: 'string'
		},
		father_designation: {
			label: "Father's Designation(Present/Last)",
			type: 'string'
		},
		father_native_place: {
			label: "Father's Native Place",
			type: 'string'
		},
		mother_name: {
			label: "Mother's Name",
			type: 'string'
		},
		mother: {
			label: 'Mother',
			type: 'string'
		},
		mother_occupation: {
			label: "Mothers's Occupation",
			type: 'string'
		},
		mother_designation: {
			label: "Mothers's Designation(Present/Last)",
			type: 'string'
		},
		mother_maternal_surname: {
			label: "Mother's Maternal Surname",
			type: 'string'
		},
		mother_native_place: {
			label: "Mother's Native Place",
			type: 'string'
		},
		no_of_brothers: {
			label: 'No. of Brother(s)',
			type: 'number'
		},
		brothers_married: {
			label: 'Of which married',
			type: 'number'
		},
		no_of_sisters: {
			label: 'No. of Sister(s)',
			type: 'number'
		},
		sisters_married: {
			label: 'Of which married',
			type: 'number'
		},
		about_family: {
			label: 'About Family',
			type: 'string'
		},
		family_location: {
			label: 'Families current location',
			type: 'string'
		},
		inter_caste_parents: {
			label: 'Inter caste marriage of Parents?',
			type: 'bool'
		},
		parents_living_seperately: {
			label: 'Parents living separately?',
			type: 'bool'
		}
	};

	otherInfoMapping = {
		family_values: {
			label: 'Family Values',
			type: 'string'
		},
		family_financial_background: {
			label: 'Family Financial Background',
			type: 'string'
		},
		family_annual_income: {
			label: "Family's Annual Income",
			type: 'string'
		},
		home: {
			label: 'Home',
			type: 'string'
		},
		home_type: {
			label: 'Home Type',
			tagType: 'home_type',
			type: 'tag-array'
		},
		other_home_type: {
			label: 'Other Home Type',
			tagType: 'home_type',
			type: 'tag-array'
		},
		real_estate: {
			label: 'Real Estate',
			tagType: 'real_estate',
			type: 'tag-array'
		},
		vehicle: {
			label: 'Vehicle',
			type: 'bool'
		},
		vehicle_type: {
			label: 'Vehicle Type',
			tagType: 'vehicle_type',
			type: 'tag-array'
		},
		loans: {
			label: 'Loans',
			tagType: 'loan',
			type: 'tag-array'
		},
		other_loans: {
			label: 'Loans / Financial Liabilities',
			type: 'string'
		},
		family_medial_history: {
			label: "Family's Medical History",
			type: 'string'
		}
	};

	render() {
		const { family, userProfileId, updateFamily, updateFamilyOtherInformation } = this.props;
		if (!family) return null;
		return (
			<View>
				<CollapsibleTable
					title="Family Information"
					object={family}
					mapping={this.mapping}
					updateAction={updateFamily}
					userProfileId={userProfileId}
				/>
				<CollapsibleTable
					title="Other Information"
					object={family.family_other_information}
					mapping={this.otherInfoMapping}
					updateAction={updateFamilyOtherInformation}
					userProfileId={userProfileId}
				/>
			</View>
		);
	}
}

const mapStateToProps = (state: IRootState, props: IFamilyTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const family = profile.family;
		return {
			family
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateFamily: bindActionCreators(updateFamily, dispatch),
		updateFamilyOtherInformation: bindActionCreators(updateFamilyOtherInformation, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FamilyTable);
