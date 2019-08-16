import * as React from 'react';
import CollapsibleTable from './index';
import { Lifestyle } from '../../store/reducers/account-defination';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updateLifestyle } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';

interface ILifestyleTableProps {
	userProfileId: number;
}
interface ILifestyleTableMapStateToProps {
	lifestyle?: Lifestyle;
}
interface ILifestyleTableMapDispatchToProps {
	updateLifestyle: () => any;
}

export const LifestyleTableDietOptions = [
	{
		label: 'Not Set',
		value: null
	},
	{
		label: 'Veg',
		value: 'veg'
	},
	{
		label: 'Non-Veg Frequently',
		value: 'non-veg-freq'
	},
	{
		label: 'Eggetarian',
		value: 'eggetarian'
	},
	{
		label: 'Non-Veg Occasionally',
		value: 'non-veg-occa'
	},
	{
		label: 'Others (Jain, Vegan)',
		value: 'others'
	},
	{
		label: 'Any',
		value: 'any'
	}
];
export const LifestyleTableSmokingOptions = [
	{
		label: 'Not Set',
		value: null
	},
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	},
	{
		label: 'Any',
		value: 'any'
	}
];

export const LifestyleTableDrinkOptions = [
	{
		label: 'Not Set',
		value: null
	},
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	},
	{
		label: 'Any',
		value: 'any'
	}
];
export const LifestyleTableHotelingOptions = [
	{
		label: 'Not Set',
		value: null
	},
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	},
	{
		label: 'Any',
		value: 'any'
	}
];
export const LifestyleTablePartyingOptions = [
	{
		label: 'Not Set',
		value: null
	},
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	},
	{
		label: 'Any',
		value: 'any'
	}
];

class LifestyleTable extends React.Component<
	ILifestyleTableProps & ILifestyleTableMapDispatchToProps & ILifestyleTableMapStateToProps
> {
	mappings = {
		diet: {
			label: 'Diet',
			type: 'choice',
			choice: {
				options: LifestyleTableDietOptions
			}
		},
		smoking: {
			label: 'Smoking',
			type: 'choice',
			choice: {
				options: LifestyleTableSmokingOptions
			}
		},
		drinking: {
			label: 'Drinking',
			type: 'choice',
			choice: {
				options: LifestyleTableDrinkOptions
			}
		},
		hoteling: {
			label: 'Hoteling',
			type: 'choice',
			choice: {
				options: LifestyleTableHotelingOptions
			}
		},
		partying: {
			label: 'Partying',
			type: 'choice',
			choice: {
				options: LifestyleTablePartyingOptions
			}
		},
		socialNetworking: {
			label: 'Social Networking',
			tagType: 'social',
			type: 'tag-array'
		},
		priorities: {
			label: 'Priorities',
			tagType: 'priority',
			type: 'tag-array'
		},
		hobbies: {
			label: 'Hobbies',
			tagType: 'hobby',
			type: 'tag-array'
		},
		sports: {
			label: 'Sports and Fitness',
			tagType: 'sports',
			type: 'tag-array'
		}
	};

	render() {
		const { lifestyle, userProfileId, updateLifestyle } = this.props;
		if (!lifestyle) return null;
		return (
			<CollapsibleTable
				title="Personal Habits and Lifestyle"
				object={lifestyle}
				mapping={this.mappings}
				updateAction={updateLifestyle}
				userProfileId={userProfileId}
			/>
		);
	}
}

const mapStateToProps = (initialState: IRootState, ownProps: ILifestyleTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
	if (profile) {
		const lifestyle = profile.lifestyle;
		return {
			lifestyle
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateLifestyle: bindActionCreators<Action<any>, any>(updateLifestyle, dispatch)
	};
};

export default connect<
	ILifestyleTableMapStateToProps,
	ILifestyleTableMapDispatchToProps,
	ILifestyleTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(LifestyleTable);
