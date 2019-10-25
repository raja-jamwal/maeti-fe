import * as React from 'react';
import { View } from 'react-native';
import ProfileInfoTab from '../components/profile-info-tab/index';
import GlobalStyles from '../styles/global';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import InterestMessageBar from '../components/interest-message-bar/interest-message-bar';
import { IRootState } from '../store/index';
import { connect } from 'react-redux';
import { getCurrentUserProfileId } from '../store/reducers/account-reducer';
import { bindActionCreators, Dispatch } from 'redux';
import {
	getViewedMyContact,
	markProfileAsViewed,
	saveViewedMyContact
} from '../store/reducers/user-profile-reducer';

interface IProfileScreenMapStateToProps {
	selfProfileId?: number | null;
}

interface IProfileScreenMapDispatchToProps {
	markProfileAsViewed: (userProfileId: number) => any;
	saveViewedMyContact: (userProfileId: number) => any;
	getViewedMyContact: (userProfileId: number) => any;
}

type IProfileScreenProps = NavigationInjectedProps &
	IProfileScreenMapStateToProps &
	IProfileScreenMapDispatchToProps;

class ProfileScreen extends React.Component<IProfileScreenProps> {
	static navigationOptions = {
		title: 'My Profile'
	};

	constructor(props: NavigationInjectedProps & IProfileScreenProps) {
		super(props);
	}

	componentDidMount() {
		const { selfProfileId, navigation, markProfileAsViewed } = this.props;
		const userProfileId = navigation.getParam('userProfileId');
		if (!!userProfileId && userProfileId !== selfProfileId) {
			markProfileAsViewed(userProfileId);
		}
	}

	render() {
		const { navigation, selfProfileId, saveViewedMyContact, getViewedMyContact } = this.props;
		const userProfileId = navigation.getParam('userProfileId');
		if (!userProfileId || !selfProfileId) return null;
		const showInterestMessageBar = !!selfProfileId && userProfileId !== selfProfileId;
		return (
			<View style={GlobalStyles.expand}>
				<ProfileInfoTab
					userProfileId={userProfileId}
					selfProfileId={selfProfileId}
					saveViewedMyContact={saveViewedMyContact}
					getViewedMyContact={getViewedMyContact}
				/>
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

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		markProfileAsViewed: bindActionCreators(markProfileAsViewed, dispatch),
		saveViewedMyContact: bindActionCreators(saveViewedMyContact, dispatch),
		getViewedMyContact: bindActionCreators(getViewedMyContact, dispatch)
	};
};

export default connect<
	IProfileScreenMapStateToProps,
	IProfileScreenMapDispatchToProps,
	any,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(withNavigation(ProfileScreen));
