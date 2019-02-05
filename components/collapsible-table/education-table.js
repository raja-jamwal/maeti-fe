import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class EducationTable extends React.Component {
	mappings = {
		mediumOfPrimaryEducation: {
			label: 'Medium of Primary Education',
			type: 'string',
			choice: {
				options: [
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
		highestEducationLevel: {
			label: 'Highest Education Level',
			type: 'string',
			choice: {
				options: [
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
		educationField: {
			label: 'Education Field',
			type: 'string',
			choice: {
				options: [
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
		additionalEducation: {
			label: 'Additional Education',
			type: 'string'
		},
		university: {
			label: 'University / College',
			type: 'string'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="Education Information"
				object={AccountFixture.education}
				mapping={this.mappings}
			/>
		);
	}
}
