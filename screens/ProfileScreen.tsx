import * as React from 'react';
import { View } from 'react-native';
import ProfileInfoTab from '../components/profile-info-tab';
import GlobalStyles from '../styles/global';
import { connect } from 'react-redux';
import { IRootState } from '../store';

interface IProfileScreenProps {
	userProfileId: number;
}

class ProfileScreen extends React.Component<IProfileScreenProps> {
	static navigationOptions = {
		title: 'My Profile'
	};

	constructor(props: IProfileScreenProps) {
		super(props);
	}

	render() {
		const { userProfileId } = this.props;
		if (!userProfileId) return null;
		return (
			<View style={GlobalStyles.expand}>
				<ProfileInfoTab userProfileId={userProfileId} />
			</View>
		);
	}
}

const mapStateToProps = (state: IRootState) => {
	// later userProfileId will come from nav param
	const userProfileId = state.account && state.account.userProfile.id;
	return {
		userProfileId
	};
};

export default connect(
	mapStateToProps,
	null
)(ProfileScreen);
