import * as React from 'react';
import CollapsibleTable from './index';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { Investments } from '../../store/reducers/account-defination';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updateInvestment } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';

interface IInvestmentTableProps {
	userProfileId: number;
}

interface IInvestmentTableMapStateToProps {
	investments?: Investments;
}

interface IInvestmentMapDispatchToProps {
	updateInvestment: () => any;
}

class InvestmentTable extends React.Component<
	IInvestmentTableProps & IInvestmentMapDispatchToProps & IInvestmentTableMapStateToProps
> {
	mappings = {
		home: {
			label: 'Home',
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
			tagType: 'vehicle_type',
			type: 'tag-array'
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

const mapStateToProps = (initialState: IRootState, ownProps: IInvestmentTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
	if (profile) {
		const investments = profile.investments;
		return {
			investments
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateInvestment: bindActionCreators<Action<any>, any>(updateInvestment, dispatch)
	};
};

export default connect<
	IInvestmentTableMapStateToProps,
	IInvestmentMapDispatchToProps,
	IInvestmentTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(InvestmentTable);
