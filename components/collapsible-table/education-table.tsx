import * as React from 'react';
import CollapsibleTable from '../collapsible-table';
import { IRootState } from '../../store';
import { connect } from 'react-redux';
import { Education } from '../../store/reducers/account-defination';
import { bindActionCreators, Dispatch } from 'redux';
import { updateEducation } from '../../store/reducers/user-profile-reducer';

interface IEducationTableProps {
	userProfileId: number;
	education: Education;
	updateEducation: () => any;
}

class EducationTable extends React.Component<IEducationTableProps> {
	mappings = {
		medium_of_primary_education: {
			label: 'Medium of Primary Education',
			type: 'choice',
			choice: {
				options: [
					{
						label: 'Not Set',
						value: null
					},
					{
						label: 'English',
						value: 'english'
					},
					{
						label: 'Gujrati',
						value: 'gujrati'
					},
					{
						label: 'Hindi',
						value: 'hindi'
					},
					{
						label: 'Kannada',
						value: 'kannada'
					},
					{
						label: 'Marathi',
						value: 'marathi'
					},
					{
						label: 'Marathi+English',
						value: 'marathi+english'
					},
					{
						label: 'Other',
						value: 'other'
					}
				]
			}
		},
		highest_education_level: {
			label: 'Highest Education Level',
			type: 'choice',
			choice: {
				options: [
					{
						label: 'Not Set',
						value: null
					},
					{
						label: 'Post Graduate',
						value: 'post_graduate'
					},
					{
						label: 'International Degree',
						value: 'international_degree'
					},
					{
						label: 'Graduate',
						value: 'graduate'
					},
					{
						label: 'Phd',
						value: 'phd'
					},
					{
						label: 'Diploma',
						value: 'diploma'
					},
					{
						label: 'Undergraduate',
						value: 'undergraduate'
					}
				]
			}
		},
		education_field: {
			label: 'Education Field',
			type: 'choice',
			choice: {
				options: [
					{
						label: 'Not Set',
						value: null
					},
					{
						label: 'UPSC / MPSC',
						value: 'upsc'
					},
					{
						label: 'Architect',
						value: 'architect'
					},
					{
						label: 'Computer / IT',
						value: 'it'
					},
					{
						label: 'Engineering / Technology',
						value: 'engineering'
					},
					{
						label: 'Finance',
						value: 'finance'
					},
					{
						label: 'Management',
						value: 'management'
					},
					{
						label: 'Commerce',
						value: 'commerce'
					},
					{
						label: 'Arts',
						value: 'arts'
					},
					{
						label: 'Army / Air Force / Navy',
						value: 'army'
					},
					{
						label: 'Education',
						value: 'education'
					}
				]
			}
		},
		education: {
			label: 'Education',
			type: 'string'
		},
		additional_education: {
			label: 'Additional Education',
			type: 'string'
		},
		university: {
			label: 'University / College',
			type: 'string'
		}
	};

	render() {
		const { education, userProfileId, updateEducation } = this.props;
		if (!education) return null;
		return (
			<CollapsibleTable
				title="Education Information"
				object={education}
				mapping={this.mappings}
				updateAction={updateEducation}
				userProfileId={userProfileId}
			/>
		);
	}
}

const mapStateToProps = (state: IRootState, props: IEducationTableProps) => {
	const profileId = props.userProfileId;
	const profile = state.userProfiles[profileId];
	if (profile) {
		const education = profile.education;
		return {
			education
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		updateEducation: bindActionCreators(updateEducation, dispatch)
	};
};

export default connect<any, any>(
	mapStateToProps,
	mapDispatchToProps
)(EducationTable);
