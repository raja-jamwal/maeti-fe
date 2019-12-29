import * as React from 'react';
import CollapsibleTable from './index';
import { Verification } from '../../store/reducers/account-defination';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { updateVerification } from '../../store/reducers/user-profile-reducer';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Action } from 'redux-actions';

interface IVerificationTableProps {
	userProfileId: number;
	editable: boolean;
}

interface IVerificationTableMapStateToProps {
	verification?: Verification;
}
interface IVerificationTableMapDispatchToProps {
	updateVerification: () => any;
}

class VerificationTable extends React.Component<
	IVerificationTableProps &
		IVerificationTableMapDispatchToProps &
		IVerificationTableMapStateToProps
> {
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
		const { verification, userProfileId, updateVerification, editable } = this.props;
		if (!verification) return null;
		return (
			<CollapsibleTable
				title="Verification Information"
				object={verification}
				mapping={this.mappings}
				updateAction={updateVerification}
				userProfileId={userProfileId}
				editable={editable}
			/>
		);
	}
}

const mapStateToProps = (initialState: IRootState, ownProps: IVerificationTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
	if (profile) {
		const verification = profile.verification;
		return {
			verification
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateVerification: bindActionCreators<Action<any>, any>(updateVerification, dispatch)
	};
};

export default connect<
	IVerificationTableMapStateToProps,
	IVerificationTableMapDispatchToProps,
	IVerificationTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(VerificationTable);
