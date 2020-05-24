import * as React from 'react';
import { View, InteractionManager } from 'react-native';
import ProfileInfoTab from '../components/profile-info-tab/index';
import GlobalStyles from '../styles/global';
import { withNavigation, NavigationInjectedProps } from 'react-navigation';
import InterestMessageBar from '../components/interest-message-bar/interest-message-bar';
import { IRootState } from '../store/index';
import { connect } from 'react-redux';
import { getCurrentUserProfileId } from '../store/reducers/account-reducer';
import { isProfileBlocked } from '../store/reducers/user-profile-reducer';
import { bindActionCreators, Dispatch } from 'redux';
import {
	getViewedMyContact,
	markProfileAsViewed,
	saveViewedMyContact
} from '../store/reducers/user-profile-reducer';
import { isInterestAccepted } from '../store/reducers/interest-reducer';
import { Throbber } from '../components/throbber/throbber';
import { Value } from '../components/text';
interface IProfileScreenMapStateToProps {
	selfProfileId?: number | null;
	isProfileBlocked: boolean;
}

interface IProfileScreenMapDispatchToProps {
	markProfileAsViewed: (userProfileId: number) => any;
	saveViewedMyContact: (userProfileId: number) => any;
	getViewedMyContact: (userProfileId: number) => any;
	isInterestAccepted: (fromUserId: number, toUserId: number) => any;
}

type IProfileScreenProps = NavigationInjectedProps &
	IProfileScreenMapStateToProps &
	IProfileScreenMapDispatchToProps;

interface IProfileScreenState {
	isReady: boolean;
}

class ProfileScreen extends React.Component<IProfileScreenProps, IProfileScreenState> {
	static navigationOptions = ({ navigation }) => ({
		title: navigation.getParam('profileName', 'My Profile')
	});

	constructor(props: NavigationInjectedProps & IProfileScreenProps) {
		super(props);
		this.state = {
			isReady: false
		};
	}

	componentDidMount() {
		const { selfProfileId, navigation, markProfileAsViewed } = this.props;
		const userProfileId = navigation.getParam('userProfileId');
		if (!!userProfileId && userProfileId !== selfProfileId) {
			markProfileAsViewed(userProfileId);
		}

		InteractionManager.runAfterInteractions(() => {
			this.setState({
				isReady: true
			});
		});
	}

	render() {
		const { isReady } = this.state;
		if (!isReady) {
			return (
				<View
					style={[
						GlobalStyles.expand,
						GlobalStyles.alignCenter,
						GlobalStyles.justifyCenter
					]}
				>
					<Value>&nbsp;</Value>
					<Throbber size="large" />
				</View>
			);
		}

		const {
			navigation,
			selfProfileId,
			saveViewedMyContact,
			getViewedMyContact,
			isInterestAccepted,
			isProfileBlocked
		} = this.props;
		const userProfileId = navigation.getParam('userProfileId');
		if (!userProfileId || !selfProfileId) return null;
		const showInterestMessageBar = !!selfProfileId && userProfileId !== selfProfileId;

		if (isProfileBlocked) {
			return (
				<View
					style={[
						GlobalStyles.expand,
						GlobalStyles.alignCenter,
						GlobalStyles.justifyCenter
					]}
				>
					<Value style={{ fontSize: 20 }}>Profile is not available anymore</Value>
				</View>
			);
		}

		return (
			<View style={GlobalStyles.expand}>
				<ProfileInfoTab
					userProfileId={userProfileId}
					selfProfileId={selfProfileId}
					saveViewedMyContact={saveViewedMyContact}
					getViewedMyContact={getViewedMyContact}
					isInterestAccepted={isInterestAccepted}
				/>
				{showInterestMessageBar && <InterestMessageBar userProfileId={userProfileId} />}
			</View>
		);
	}
}

const mapStateToProps = (state: IRootState, ownProps: IProfileScreenProps) => {
	const selfProfileId = getCurrentUserProfileId(state);
	const userProfileId = ownProps.navigation.getParam('userProfileId');
	return {
		selfProfileId,
		isProfileBlocked: !!isProfileBlocked(state, userProfileId)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		markProfileAsViewed: bindActionCreators(markProfileAsViewed, dispatch),
		saveViewedMyContact: bindActionCreators(saveViewedMyContact, dispatch),
		getViewedMyContact: bindActionCreators(getViewedMyContact, dispatch),
		isInterestAccepted: bindActionCreators(isInterestAccepted, dispatch)
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
