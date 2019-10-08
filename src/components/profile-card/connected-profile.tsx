import ProfileCard, { IProfileProps } from './index';
import TestProfile from './test-profile';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { IRootState } from '../../store/index';
import { getLogger } from '../../utils/logger';
import { getCurrentUserProfileId } from '../../store/reducers/account-reducer';
import { bindActionCreators, Dispatch } from 'redux';
import { setUserProfileFavourite } from '../../store/reducers/favourite-reducer';

const logger = getLogger('ConnectedProfile');

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

	const currentProfileId = getCurrentUserProfileId(state);

	const isSelfProfile = !isEmpty(userProfile) && userProfile.id === currentProfileId;

	return {
		userProfile,
		isSelfProfile
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setUserProfileFavourite: bindActionCreators(setUserProfileFavourite, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileCard);
