import * as React from 'react';
import { View } from 'react-native';
import ProfileInfoTab from '../components/profile-info-tab';
import GlobalStyles from '../styles/global';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';

interface IProfileScreenProps {
	userProfileId: number;
}

class ProfileScreen extends React.Component<NavigationInjectedProps & IProfileScreenProps> {
	static navigationOptions = {
		title: 'My Profile'
	};

	constructor(props: NavigationInjectedProps & IProfileScreenProps) {
		super(props);
	}

	render() {
		const { navigation } = this.props;
		const userProfileId = navigation.getParam('userProfileId');
		if (!userProfileId) return null;
		return (
			<View style={GlobalStyles.expand}>
				<ProfileInfoTab userProfileId={userProfileId} />
			</View>
		);
	}
}

export default withNavigation(ProfileScreen);
