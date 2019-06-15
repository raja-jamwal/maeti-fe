import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { Lifestyle } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { updateLifestyle } from '../../store/reducers/user-profile-reducer';

interface ILifestyleTableProps {
	userProfileId: number;
	lifestyle: Lifestyle;
	updateLifestyle: () => any;
}

class LifestyleTable extends React.Component<ILifestyleTableProps> {
	mappings = {
		diet: {
			label: 'Diet',
			type: 'string'
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
			type: 'string'
		},
		hoteling: {
			label: 'Hoteling',
			type: 'string'
		},
		partying: {
			label: 'Partying',
			type: 'string'
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

const mapStateToProps = (state: IRootState, props: ILifestyleTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const lifestyle = profile.lifestyle;
		return {
			lifestyle
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateLifestyle: bindActionCreators(updateLifestyle, dispatch)
	};
};

export default connect<any, any>(
	mapStateToProps,
	mapDispatchToProps
)(LifestyleTable);
