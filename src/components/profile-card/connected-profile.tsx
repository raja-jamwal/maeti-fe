import ProfileCard, { IProfileProps } from './index';
import TestProfile from './test-profile';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { IRootState } from '../../store/index';
import { getLogger } from '../../utils/logger';

const mapStateToProps = (state: IRootState, ownProps: IProfileProps) => {
	const accountData = state.account;

	if (isEmpty(accountData)) {
		logger.log('dev: empty user account, we probably deleted the account in server restart');
		logger.log('dev: create a new account');
		return {};
	}

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

const ConnectedProfile = () =>
	connect(
		mapStateToProps,
		null
	)(ProfileCard);

const logger = getLogger(ConnectedProfile);

export default ConnectedProfile();

// export default TestProfile;
