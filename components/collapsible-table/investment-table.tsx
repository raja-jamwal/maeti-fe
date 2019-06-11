import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { Investments } from '../../store/reducers/account-defination';
import { bindActionCreators, Dispatch } from 'redux';
import { updateInvestment } from '../../store/reducers/user-profile-reducer';

interface IInvestmentTableProps {
	userProfileId: number;
	investments: Investments;
	updateInvestment: () => any;
}

class InvestmentTable extends React.Component<IInvestmentTableProps> {
	mappings = {
		home: {
			label: 'Home',
			type: 'string'
		},
		realEstate: {
			label: 'Real Estate',
			type: 'string'
		},
		vehicle: {
			label: 'Vehicle',
			type: 'string'
		},
		investments: {
			label: 'Investments',
			tagType: 'investment',
			type: 'tag-array'
		}
	};

	render() {
		const { investments, userProfileId, updateInvestment } = this.props;
		if (!investments) return null;
		return (
			<CollapsibleTable
				title="Personal Investments"
				object={investments}
				mapping={this.mappings}
				updateAction={updateInvestment}
				userProfileId={userProfileId}
			/>
		);
	}
}

const mapStateToProps = (state: IRootState, props: IInvestmentTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const investments = profile.investments;
		return {
			investments
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateInvestment: bindActionCreators(updateInvestment, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(InvestmentTable);
