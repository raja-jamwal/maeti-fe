import * as React from 'react';
import { View } from 'react-native';
import ProfileInfoTab from '../components/profile-info-tab/index';
import GlobalStyles from '../styles/global';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import InterestMessageBar from '../components/interest-message-bar/interest-message-bar';
import { IRootState } from '../store/index';
import { connect } from 'react-redux';
import { getCurrentUserProfileId } from '../store/reducers/account-reducer';

interface IProfileScreenProps {}

interface IProfileScreenMapStateToProps {
	selfProfileId?: number | null;
}

class ProfileScreen extends React.Component<
	NavigationInjectedProps & IProfileScreenMapStateToProps & IProfileScreenProps
> {
	static navigationOptions = {
		title: 'My Profile'
	};

	constructor(props: NavigationInjectedProps & IProfileScreenProps) {
		super(props);
	}

	render() {
		const { navigation, selfProfileId } = this.props;
		const userProfileId = navigation.getParam('userProfileId');
		if (!userProfileId || !selfProfileId) return null;
		const showInterestMessageBar = !!selfProfileId && userProfileId !== selfProfileId;
		return (
			<View style={GlobalStyles.expand}>
				<ProfileInfoTab userProfileId={userProfileId} />
				{showInterestMessageBar && <InterestMessageBar userProfileId={userProfileId} />}
			</View>
		);
	}
}

const mapStateToProps = (state: IRootState) => {
	const selfProfileId = getCurrentUserProfileId(state);
	return {
		selfProfileId
	};
};

export default connect<IProfileScreenMapStateToProps, any, any, IRootState>(
	mapStateToProps,
	null
)(withNavigation(ProfileScreen));
