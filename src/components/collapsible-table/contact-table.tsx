import * as React from 'react';
import CollapsibleTable from './index';
import { ContactInformation } from '../../store/reducers/account-defination';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updateContactInformation } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';

interface IContactTableProps {
	userProfileId: number;
}

interface IContactTableMapStateToProps {
	contactInformation?: ContactInformation;
}

interface IContactTableMapDispatchToProps {
	updateContactInformation: () => any;
}

class ContactTable extends React.Component<
	IContactTableProps & IContactTableMapDispatchToProps & IContactTableMapStateToProps
> {
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
		mobileNumber1Of: {
			label: 'Mobile Number 1 Of',
			type: 'string'
		},
		mobileNumber2: {
			label: 'Mobile Number 2',
			type: 'string'
		},
		mobileNumber2Of: {
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

const mapStateToProps = (initialState: IRootState, ownProps: IContactTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
	if (profile) {
		const contactInformation = profile.contactInformation;
		return {
			contactInformation
		};
	}

	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateContactInformation: bindActionCreators<Action<any>, any>(
			updateContactInformation,
			dispatch
		)
	};
};

export default connect<
	IContactTableMapStateToProps,
	IContactTableMapDispatchToProps,
	IContactTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(ContactTable);
