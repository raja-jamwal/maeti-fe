import * as React from 'react';
import CollapsibleTable from './index';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { UserProfile } from '../../store/reducers/account-defination';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updateUserProfile } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';
import { isAccountPaid } from '../../store/reducers/account-reducer';

interface IProfileTableProps {
	userProfileId: number;
	editable: boolean;
}
interface IProfileTableMapStateToProps {
	userProfile?: UserProfile;
	isAccountPaid: boolean;
}
interface IProfileTableMapDispatchToProps {
	updateUserProfile: () => any;
}

export const GenderOptions = [
	{
		label: 'Looking for Bride (हम दुल्हन की तलाश कर रहे हैं)',
		value: 'male'
	},
	{
		label: 'Looking for Groom (हम दूल्हे की तलाश कर रहे हैं)',
		value: 'female'
	}
];
export const CreatedByOptions = [
	{
		label: 'Self',
		value: 'self'
	},
	{
		label: 'Father',
		value: 'father'
	},
	{
		label: 'Mother',
		value: 'mother'
	},
	{
		label: 'Brother',
		value: 'brother'
	},
	{
		label: 'Sister',
		value: 'sister'
	},
	{
		label: 'Other',
		value: 'other'
	}
];

export const MaritalStatusOptions = [
	{
		label: 'Never Married',
		value: 'never-married'
	},
	{
		label: 'Divorced',
		value: 'divorced'
	},
	{
		label: 'Widow / Widower',
		value: 'widow-widower'
	},
	{
		label: 'Awaiting Divorce / Legally Separated',
		value: 'awaiting-div-legal-sep'
	}
];
export const BloodGroupOptions = [
	{
		label: 'A +ve',
		value: 'a+ve'
	},
	{
		label: 'B +ve',
		value: 'b+ve'
	},
	{
		label: 'O +ve',
		value: 'o+ve'
	},
	{
		label: 'AB +ve',
		value: 'ab+ve'
	},
	{
		label: 'A -ve',
		value: 'a-ve'
	},
	{
		label: 'B -ve',
		value: 'b-ve'
	},
	{
		label: 'O -ve',
		value: 'o-ve'
	},
	{
		label: 'AB -ve',
		value: 'ab-ve'
	},
	{
		label: 'NA',
		value: 'na'
	},
	{
		label: 'Yet To Be Tested',
		value: 'to-be-tested'
	}
];

export const ProfileTableMotherTongueOptions = [
	{
		label: 'Sindhi',
		value: 'sindhi'
	},
	{
		label: 'Hindi',
		value: 'hindi'
	},
	{
		label: 'English',
		value: 'english'
	}
];
export const BodyComplexionOptions = [
	{
		label: 'Fair',
		value: 'fair'
	},
	{
		label: 'Very Fair',
		value: 'very-fair'
	},
	{
		label: 'Wheatish',
		value: 'wheatish'
	},
	{
		label: 'Wheatish Brown',
		value: 'wheatish-brown'
	},
	{
		label: 'Dark',
		value: 'dark'
	}
];
export const ProfileTableLensesOptions = [
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	}
];

export const SalutationOptions = [
	{
		label: 'Mr.',
		value: 'mr'
	},
	{
		label: 'Miss.',
		value: 'miss'
	},
	{
		label: 'Dr.',
		value: 'dr'
	},
	{
		label: 'Prof.',
		value: 'prof'
	},
	{
		label: 'Mrs.',
		value: 'mrs'
	}
];
export const ProfileTableWeightOptions = [
	{
		label: 'Below 40Kg',
		value: 40
	},
	{
		label: '40Kgs - 50Kgs',
		value: 45
	},
	{
		label: '50Kgs - 60Kgs',
		value: 55
	},
	{
		label: '60Kgs - 70Kgs',
		value: 65
	},
	{
		label: '70Kgs - 80Kgs',
		value: 75
	},
	{
		label: '80Kgs - 90Kgs',
		value: 85
	},
	{
		label: 'Greater than 90Kgs',
		value: 90
	}
];
export const ProfileTableHeightOptions = [
	{
		label: 'Below 4.1 ft.',
		value: 123
	},
	{
		label: '4.1 ft.',
		value: 124
	},
	{
		label: '4.2 ft.',
		value: 127
	},
	{
		label: '4.3 ft.',
		value: 130
	},
	{
		label: '4.4 ft.',
		value: 132
	},
	{
		label: '4.5 ft.',
		value: 135
	},
	{
		label: '4.6 ft.',
		value: 137
	},
	{
		label: '4.7 ft.',
		value: 140
	},
	{
		label: '4.8 ft.',
		value: 142
	},
	{
		label: '4.9 ft.',
		value: 145
	},
	{
		label: '4.10 ft.',
		value: 147
	},
	{
		label: '4.11 ft.',
		value: 150
	},
	{
		label: '5.0 ft.',
		value: 152
	},
	{
		label: '5.1 ft.',
		value: 155
	},
	{
		label: '5.2 ft.',
		value: 158
	},
	{
		label: '5.3 ft.',
		value: 160
	},
	{
		label: '5.4 ft.',
		value: 163
	},
	{
		label: '5.5 ft.',
		value: 165
	},
	{
		label: '5.6 ft.',
		value: 168
	},
	{
		label: '5.7 ft.',
		value: 170
	},
	{
		label: '5.8 ft.',
		value: 173
	},
	{
		label: '5.9 ft.',
		value: 175
	},
	{
		label: '5.10 ft.',
		value: 178
	},
	{
		label: '5.11 ft.',
		value: 180
	},
	{
		label: '6.0 ft.',
		value: 183
	},
	{
		label: '6.1 ft.',
		value: 185
	},
	{
		label: '6.2 ft.',
		value: 188
	},
	{
		label: '6.3 ft.',
		value: 191
	},
	{
		label: '6.4 ft.',
		value: 193
	},
	{
		label: '6.5 ft.',
		value: 196
	},
	{
		label: '6.6 ft.',
		value: 198
	},
	{
		label: '6.7 ft.',
		value: 201
	},
	{
		label: '6.8 ft.',
		value: 203
	},
	{
		label: '6.9 ft.',
		value: 206
	},
	{
		label: '6.10 ft.',
		value: 209
	},
	{
		label: '6.11 ft.',
		value: 211
	},
	{
		label: '7 ft. or Above',
		value: 213
	}
];
export const ProfileTableBodyTypeOptions = [
	{
		label: 'Average',
		value: 'average'
	},
	{
		label: 'Athletic',
		value: 'athletic'
	},
	{
		label: 'Slim',
		value: 'slim'
	},
	{
		label: 'Heavy',
		value: 'heavy'
	}
];

export const ProfileMapping = {
	gender: {
		label: 'Looking for (की तलाश कर रहे हैं)',
		type: 'choice',
		isNotEditable: true,
		choice: {
			options: GenderOptions
		}
	},
	createdBy: {
		label: 'Profile created by',
		type: 'choice',
		choice: {
			options: CreatedByOptions
		}
	},
	salutation: {
		label: 'Salutation',
		type: 'choice',
		choice: {
			options: SalutationOptions
		}
	},
	fullName: {
		label: 'Full Name (Groom/Bride) - पूरा नाम (वर / वधू)',
		type: 'string',
		isPaidFeature: true
	},
	maritalStatus: {
		label: 'Marital Status',
		type: 'choice',
		choice: {
			options: MaritalStatusOptions
		}
	},
	about: {
		label: 'About (Groom/Bride) - दूल्हे / दुल्हन के बारे में',
		type: 'about'
	},
	dob: {
		label: 'Date of Birth',
		type: 'date'
	},
	height: {
		label: 'Height',
		type: 'choice',
		choice: {
			options: ProfileTableHeightOptions
		}
	},
	weight: {
		label: 'Weight',
		type: 'choice',
		choice: {
			options: ProfileTableWeightOptions
		}
	},
	bodyType: {
		label: 'Body Type',
		type: 'choice',
		choice: {
			options: ProfileTableBodyTypeOptions
		}
	},
	bodyComplexion: {
		label: 'Body Complexion',
		type: 'choice',
		choice: {
			options: BodyComplexionOptions
		}
	},
	lenses: {
		label: 'Spect / Lenses',
		type: 'choice',
		choice: {
			options: ProfileTableLensesOptions
		}
	},
	bloodGroup: {
		label: 'Blood Group',
		type: 'choice',
		choice: {
			options: BloodGroupOptions
		}
	},
	motherTongue: {
		label: 'Mother Tongue',
		type: 'choice',
		choice: {
			options: ProfileTableMotherTongueOptions
		}
	},
	specialCases: {
		label: 'Special Cases',
		tagType: 'case',
		type: 'tag-array'
	},
	describeMyself: {
		label: 'Described as',
		tagType: 'description',
		type: 'tag-array'
	}
};

class ProfileTable extends React.Component<
	IProfileTableProps & IProfileTableMapDispatchToProps & IProfileTableMapStateToProps
> {
	render() {
		const {
			userProfile,
			userProfileId,
			updateUserProfile,
			editable,
			isAccountPaid
		} = this.props;
		return (
			<CollapsibleTable
				title="Basic Information"
				object={userProfile}
				mapping={ProfileMapping}
				updateAction={updateUserProfile}
				userProfileId={userProfileId}
				editable={editable}
				isAccountPaid={isAccountPaid}
			/>
		);
	}
}

const mapStateToProps = (initialState: IRootState, ownProps: IProfileTableProps) => {
	const profileId = ownProps.userProfileId;
	const userProfile = initialState.userProfiles[profileId];
	return { userProfile, isAccountPaid: isAccountPaid(initialState) };
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateUserProfile: bindActionCreators<Action<any>, any>(updateUserProfile, dispatch)
	};
};

export default connect<
	IProfileTableMapStateToProps,
	IProfileTableMapDispatchToProps,
	IProfileTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(ProfileTable);
