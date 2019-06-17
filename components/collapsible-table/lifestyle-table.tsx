import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { Lifestyle } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
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

class LifestyleTable extends React.Component<
	ILifestyleTableProps & ILifestyleTableMapDispatchToProps & ILifestyleTableMapStateToProps
> {
	mappings = {
		diet: {
			label: 'Diet',
			type: 'choice',
			choice: {
				options: [
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
				]
			}
		},
		smoking: {
			label: 'Smoking',
			type: 'choice',
			choice: {
				options: [
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
				]
			}
		},
		drinking: {
			label: 'Drinking',
			type: 'choice',
			choice: {
				options: [
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
				]
			}
		},
		hoteling: {
			label: 'Hoteling',
			type: 'choice',
			choice: {
				options: [
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
				]
			}
		},
		partying: {
			label: 'Partying',
			type: 'choice',
			choice: {
				options: [
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
				]
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
