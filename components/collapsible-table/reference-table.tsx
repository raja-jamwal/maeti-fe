import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { UserReference } from '../../store/reducers/account-defination';
import { bindActionCreators, Dispatch } from 'redux';
import { updateUserReference } from '../../store/reducers/user-profile-reducer';

interface IReferenceTableProps {
	userProfileId: number;
	userReference: UserReference;
	updateUserReference: () => any;
}

class ReferenceTable extends React.Component<IReferenceTableProps> {
	mappings = {
		relative_name: {
			label: 'Relative Name',
			type: 'string'
		},
		relation_with_member: {
			label: 'Relation with the member',
			type: 'string'
		},
		contact_number: {
			label: 'Contact Number',
			type: 'string'
		},
		address: {
			label: 'Address',
			type: 'string'
		}
	};

	render() {
		const { userReference, userProfileId, updateUserReference } = this.props;
		if (!userReference) return null;
		return (
			<CollapsibleTable
				title="References"
				object={userReference}
				mapping={this.mappings}
				updateAction={updateUserReference}
				userProfileId={userProfileId}
			/>
		);
	}
}

const mapStateToProps = (state: IRootState, props: IReferenceTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const userReference = profile.user_reference;
		return {
			userReference
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateUserReference: bindActionCreators(updateUserReference, dispatch)
	};
};

export default connect<any, any>(
	mapStateToProps,
	mapDispatchToProps
)(ReferenceTable);
