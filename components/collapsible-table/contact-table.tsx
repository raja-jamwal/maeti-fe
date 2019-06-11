import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { ContactInformation } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { updateContactInformation } from '../../store/reducers/user-profile-reducer';

interface IContactTableProps {
	userProfileId: number;
	contactInformation: ContactInformation;
	updateContactInformation: () => any;
}

class ContactTable extends React.Component<IContactTableProps> {
	mappings = {
		address: {
			label: 'Address',
			type: 'string'
		},
		pinCode: {
			label: 'Pin Code',
			type: 'string'
		},
		residentialCity: {
			label: 'Residential City',
			type: 'string'
		},
		mobileNumber1: {
			label: 'Mobile Number 1',
			type: 'string'
		},
		mobileNumberOf1: {
			label: 'Mobile Number 1 Of',
			type: 'string'
		},
		mobileNumber2: {
			label: 'Mobile Number 2',
			type: 'string'
		},
		mobileNumberOf2: {
			label: 'Mobile Number 2 Of',
			type: 'string'
		},
		landlineNumber: {
			label: 'Landline Number',
			type: 'string'
		},
		emailId: {
			label: 'Email ID',
			type: 'string'
		},
		emailIdOf: {
			label: 'Email ID Of',
			type: 'string'
		},
		alternateEmailId: {
			label: 'Alternate Email ID',
			type: 'string'
		},
		alternateEmailIdOf: {
			label: 'Alternate Email ID Of',
			type: 'string'
		},
		facebookLink: {
			label: 'Facebook Link',
			type: 'string'
		},
		linkedinLink: {
			label: 'LinkedIn Link',
			type: 'string'
		}
	};

	render() {
		const { contactInformation, userProfileId, updateContactInformation } = this.props;
		if (!contactInformation) return null;
		return (
			<CollapsibleTable
				title="Contact Information"
				object={contactInformation}
				mapping={this.mappings}
				updateAction={updateContactInformation}
				userProfileId={userProfileId}
			/>
		);
	}
}

const mapStateToProps = (state: IRootState, props: IContactTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const contactInformation = profile.contactInformation;
		return {
			contactInformation
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateContactInformation: bindActionCreators(updateContactInformation, dispatch)
	};
};

export default connect<any, any>(
	mapStateToProps,
	mapDispatchToProps
)(ContactTable);
