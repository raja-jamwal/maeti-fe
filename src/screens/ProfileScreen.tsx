import * as React from 'react';
import { View } from 'react-native';
import ProfileInfoTab from '../components/profile-info-tab/index';
import GlobalStyles from '../styles/global';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import InterestMessageBar from '../components/interest-message-bar/interest-message-bar';
import { IRootState } from '../store/index';
import { connect } from 'react-redux';

interface IProfileScreenProps {}

interface IProfileScreenMapStateToProps {
	selfProfileId?: number;
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
		if (!userProfileId) return null;
		const showInterestMessageBar = !!selfProfileId && userProfileId !== selfProfileId;
		return (
			<View style={GlobalStyles.expand}>
				<ProfileInfoTab userProfileId={userProfileId} />
				{showInterestMessageBar && <InterestMessageBar />}
			</View>
		);
	}
}

const mapStateToProps = (state: IRootState) => {
	const selfProfileId =
		state.account && state.account.userProfile && state.account.userProfile.id;
	return {
		selfProfileId: selfProfileId
	};
};

export default connect<IProfileScreenMapStateToProps, any, any, IRootState>(
	mapStateToProps,
	null
)(withNavigation(ProfileScreen));
