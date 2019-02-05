import React from 'react';
import CollapsibleTable from '../collapsible-table';
import AccountFixture from '../../fixtures/account.json';

export default class ProfessionTable extends React.Component {
	mappings = {
		occupation: {
			label: 'Occupation',
			type: 'string',
			choice: {
				options: [
					{
						label: 'Business',
						value: 'business'
					},
					{
						label: 'CA/ICWA/CS',
						value: 'ca'
					},
					{
						label: 'Consultant',
						value: 'consultant'
					},
					{
						label: 'Dentist',
						value: 'dentist'
					},
					{
						label: 'Doctor',
						value: 'doctor'
					},
					{
						label: 'Employee',
						value: 'employee'
					},
					{
						label: 'Engineer/Architect',
						value: 'engineer'
					},
					{
						label: 'Gov. Servant',
						value: 'gov'
					},
					{
						label: 'Jobseeker',
						value: 'job_seeker'
					},
					{
						label: 'Lawyer',
						value: 'lawyer'
					},
					{
						label: 'Military Services',
						value: 'military'
					},
					{
						label: 'Other',
						value: 'other'
					},
					{
						label: 'Professionals',
						value: 'professionals'
					},
					{
						label: 'Professor/Teacher',
						value: 'professor'
					},
					{
						label: 'Research fellow',
						value: 'research'
					},
					{
						label: 'Self Employed',
						value: 'self'
					},
					{
						label: 'Service+Business',
						value: 'service+business'
					},
					{
						label: 'Student',
						value: 'student'
					}
				]
			}
		},
		workingField: {
			label: 'Working Field',
			type: 'string',
			choice: {
				options: [
					{
						label: 'Research',
						value: 'research'
					},
					{
						label: 'Merchant navy',
						value: 'merchant_navy'
					},
					{
						label: 'Private Sector',
						value: 'private_sector'
					},
					{
						label: 'MNC',
						value: 'mnc'
					},
					{
						label: 'Govt./Publish',
						value: 'govt'
					},
					{
						label: 'Business/Self Employeed',
						value: 'business'
					},
					{
						label: 'Military / Defense',
						value: 'military'
					},
					{
						label: 'Professional',
						value: 'professional'
					},
					{
						label: 'Student',
						value: 'student'
					},
					{
						label: 'Jobseeker',
						value: 'jobseeker'
					},
					{
						label: 'Other',
						value: 'other'
					},
					{
						label: 'Scientist',
						value: 'scientist'
					}
				]
			}
		},
		lengthOfEmployment: {
			label: 'Length of Employment(in Month)',
			type: 'number'
		},
		company: {
			label: 'Company / Organisation name',
			type: 'string'
		},
		designation: {
			label: 'Designation',
			type: 'string'
		},
		currency: {
			label: 'Currency',
			type: 'string',
			choice: {
				options: [
					{
						label: 'Rupees',
						value: 'rupees'
					},
					{
						label: 'US Dollar',
						value: 'us_dollar'
					},
					{
						label: 'Euro',
						value: 'euro'
					},
					{
						label: 'Swiss Franc',
						value: 'swiss_franc'
					},
					{
						label: 'Australian Dollar',
						value: 'aus_dollar'
					},
					{
						label: 'Canadian Dollar',
						value: 'can_dollar'
					},
					{
						label: 'Emirati Dirham',
						value: 'dirham'
					},
					{
						label: 'Chinese Yuan Renminbi',
						value: 'yuan'
					},
					{
						label: 'Malaysian Ringgit',
						value: 'ringgit'
					},
					{
						label: 'New Zealand Dollar',
						value: 'new_zealand_dollar'
					},
					{
						label: 'British Pound',
						value: 'pound'
					},
					{
						label: 'Singapore Dollar',
						value: 'singa_dollar'
					},
					{
						label: 'Yen',
						value: 'yen'
					},
					{
						label: 'OMR',
						value: 'omr'
					},
					{
						label: 'Dinar',
						value: 'dinar'
					},
					{
						label: 'Krona',
						value: 'krona'
					},
					{
						label: 'Hongkong dollar',
						value: 'hong_dollar'
					},
					{
						label: 'Brazillan real',
						value: 'real'
					},
					{
						label: 'Saudi riyal',
						value: 'riyal'
					},
					{
						label: 'Peso',
						value: 'peso'
					},
					{
						label: 'Rand',
						value: 'rand'
					},
					{
						label: 'Qatari Rial',
						value: 'rial'
					},
					{
						label: 'Polish Zloty',
						value: 'zloty'
					},
					{
						label: 'MOP',
						value: 'mop'
					}
				]
			}
		},
		monthlyIncome: {
			label: 'Monthly Income',
			type: 'currency'
		},
		annualIncome: {
			label: 'Annual Income',
			type: 'currency'
		},
		loans: {
			label: 'Loans / Financial Liabilities',
			type: 'tag-array'
		},
		otherLoans: {
			label: 'Other loans',
			type: 'string'
		},
		workCity: {
			label: 'Work City',
			type: 'string'
		}
	};

	render() {
		return (
			<CollapsibleTable
				title="Professional Information"
				object={AccountFixture.profession}
				mapping={this.mappings}
			/>
		);
	}
}
