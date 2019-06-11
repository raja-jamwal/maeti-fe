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
		fatherName: {
			label: "Father's Name",
			type: 'string'
		},
		father: {
			label: 'Father',
			type: 'string'
		},
		fatherOccupation: {
			label: "Father's Occupation",
			type: 'string'
		},
		fatherDesignation: {
			label: "Father's Designation(Present/Last)",
			type: 'string'
		},
		fatherNativePlace: {
			label: "Father's Native Place",
			type: 'string'
		},
		motherName: {
			label: "Mother's Name",
			type: 'string'
		},
		mother: {
			label: 'Mother',
			type: 'string'
		},
		motherOccupation: {
			label: "Mothers's Occupation",
			type: 'string'
		},
		motherDesignation: {
			label: "Mothers's Designation(Present/Last)",
			type: 'string'
		},
		motherMaternalSurname: {
			label: "Mother's Maternal Surname",
			type: 'string'
		},
		motherNativePlace: {
			label: "Mother's Native Place",
			type: 'string'
		},
		noOfBrothers: {
			label: 'No. of Brother(s)',
			type: 'number'
		},
		brothersMarried: {
			label: 'Of which married',
			type: 'number'
		},
		noOfSisters: {
			label: 'No. of Sister(s)',
			type: 'number'
		},
		sistersMarried: {
			label: 'Of which married',
			type: 'number'
		},
		aboutFamily: {
			label: 'About Family',
			type: 'string'
		},
		familyLocation: {
			label: 'Families current location',
			type: 'string'
		},
		interCasteParents: {
			label: 'Inter caste marriage of Parents?',
			type: 'bool'
		},
		parentsLivingSeperately: {
			label: 'Parents living separately?',
			type: 'bool'
		}
	};

	otherInfoMapping = {
		familyValues: {
			label: 'Family Values',
			type: 'string'
		},
		familyFinancialBackground: {
			label: 'Family Financial Background',
			type: 'string'
		},
		familyAnnualIncome: {
			label: "Family's Annual Income",
			type: 'string'
		},
		home: {
			label: 'Home',
			type: 'string'
		},
		homeType: {
			label: 'Home Type',
			tagType: 'home_type',
			type: 'tag-array'
		},
		otherHomeType: {
			label: 'Other Home Type',
			tagType: 'home_type',
			type: 'tag-array'
		},
		realEstate: {
			label: 'Real Estate',
			tagType: 'real_estate',
			type: 'tag-array'
		},
		vehicle: {
			label: 'Vehicle',
			type: 'bool'
		},
		vehicleType: {
			label: 'Vehicle Type',
			tagType: 'vehicle_type',
			type: 'tag-array'
		},
		loans: {
			label: 'Loans',
			tagType: 'loan',
			type: 'tag-array'
		},
		otherLoans: {
			label: 'Loans / Financial Liabilities',
			type: 'string'
		},
		familyMedicalHistory: {
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
					object={family.familyOtherInformation}
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
