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
		pin_code: {
			label: 'Pin Code',
			type: 'string'
		},
		residential_city: {
			label: 'Residential City',
			type: 'string'
		},
		mobile_number_1: {
			label: 'Mobile Number 1',
			type: 'string'
		},
		mobile_number_of_1: {
			label: 'Mobile Number 1 Of',
			type: 'string'
		},
		mobile_number_2: {
			label: 'Mobile Number 2',
			type: 'string'
		},
		mobile_number_of_2: {
			label: 'Mobile Number 2 Of',
			type: 'string'
		},
		landline_number: {
			label: 'Landline Number',
			type: 'string'
		},
		email_id: {
			label: 'Email ID',
			type: 'string'
		},
		email_id_of: {
			label: 'Email ID Of',
			type: 'string'
		},
		alternate_email_id: {
			label: 'Alternate Email ID',
			type: 'string'
		},
		alternate_email_id_of: {
			label: 'Alternate Email ID Of',
			type: 'string'
		},
		facebook_link: {
			label: 'Facebook Link',
			type: 'string'
		},
		linkedin_link: {
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
		const contactInformation = profile.contact_information;
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
