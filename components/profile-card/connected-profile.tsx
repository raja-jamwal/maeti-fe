import ProfileCard, { IProfileProps } from './index';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { IRootState } from '../../store';

const mapStateToProps = (state: IRootState, ownProps: IProfileProps) => {
	const accountData = state.account;

	if (isEmpty(accountData)) return {};

	const fallbackUserProfile = accountData.userProfile;

	const userProfile =
		(ownProps.userProfileId &&
			state.userProfiles &&
			state.userProfiles[ownProps.userProfileId]) ||
		fallbackUserProfile;

	return {
		userProfile
	};
};
export default connect(
	mapStateToProps,
	null
)(ProfileCard);
