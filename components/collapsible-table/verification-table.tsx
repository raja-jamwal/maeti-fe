import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { Verification } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { updateVerification } from '../../store/reducers/user-profile-reducer';
import { bindActionCreators, Dispatch } from 'redux';

interface IVerificationTableProps {
	userProfileId: number;
	verification: Verification;
	updateVerification: () => any;
}

class VerificationTable extends React.Component<IVerificationTableProps> {
	mappings = {
		address: {
			label: 'Address Verified',
			type: 'bool'
		},
		identity: {
			label: 'Identity Verified',
			type: 'bool'
		},
		income: {
			label: 'Income Verified',
			type: 'bool'
		}
	};

	render() {
		const { verification, userProfileId, updateVerification } = this.props;
		if (!verification) return null;
		return (
			<CollapsibleTable
				title="Verification Information"
				object={verification}
				mapping={this.mappings}
				updateAction={updateVerification}
				userProfileId={userProfileId}
			/>
		);
	}
}

const mapStateToProps = (state: IRootState, props: IVerificationTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const verification = profile.verification;
		return {
			verification
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateVerification: bindActionCreators(updateVerification, dispatch)
	};
};

export default connect<any, any>(
	mapStateToProps,
	mapDispatchToProps
)(VerificationTable);
