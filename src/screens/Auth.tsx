import * as React from 'react';
import {
	AsyncStorage,
	StyleSheet,
	Text,
	View,
	StatusBar,
	KeyboardAvoidingView
} from 'react-native';
import GlobalStyle from '../styles/global';
import { connect } from 'react-redux';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import { IS_IOS } from '../utils';
import { simpleAlert } from '../components/alert';
import { bindActionCreators } from 'redux';
import { fetchAccount, fetchAccountByToken, logAccount } from '../store/reducers/account-reducer';
import { NavigationInjectedProps, StackActions, NavigationActions } from 'react-navigation';
import { getLogger } from '../utils/logger';
import { connectRTM } from '../store/middleware/rtm-middleware';
import Button from '../components/button/button';
import * as Permissions from 'expo-permissions';
import { isEmpty, noop } from 'lodash';
import { getAccountRequest } from '../utils/account-request';
import { SafeAreaView } from 'react-native';
import { AuthHome } from '../components/auth-home';
import { modelRepository, setModelRepository } from '../utils/model-repository';

interface IAuthDispatchProps {
	fetchAccount: (id: string) => any;
	fetchAccountByToken: (token: string) => any;
	logAccount: () => any;
	connectRTM: () => any;
}

enum LOGIN_SCREENS {
	AUTH_HOME,
	ERROR
}

interface IAuthState {
	activeScreen: LOGIN_SCREENS | null;
}

type IAuthProps = NavigationInjectedProps & IAuthDispatchProps;

class Auth extends React.Component<IAuthProps, IAuthState> {
	private logger = getLogger(Auth);

	constructor(props: IAuthProps) {
		super(props);
		this.state = {
			activeScreen: null
		};

		this._tryAuth = this._tryAuth.bind(this);
		this._forceLogin = this._forceLogin.bind(this);
		this.changeScreen = this.changeScreen.bind(this);
		this.onSignUpPress = this.onSignUpPress.bind(this);
	}

	async componentDidMount() {
		// modelRepository.delete();
		await this._tryAuth();
	}

	async _tryAuth() {
		const { fetchAccountByToken, navigation, connectRTM, logAccount } = this.props;
		try {
			logAccount();
		} catch (err) {
			this.logger.log(err);
		}
		try {
			const accountRequest = await getAccountRequest();
			if (!isEmpty(accountRequest)) {
				modelRepository.load(accountRequest);
				this.logger.log('account request not empty ', accountRequest.id);
				return navigation.dispatch(
					StackActions.reset({
						index: 0,
						actions: [
							NavigationActions.navigate({
								routeName: 'UnderReviewScreen'
							})
						]
					})
				);
			}
		} catch (err) {
			this.logger.log(err);
		}

		const token = await AsyncStorage.getItem('token');
		this.logger.log(`token from storage ${token}`);

		if (token) {
			try {
				const account = await fetchAccountByToken(token);
				if (!account) {
					throw new Error('Unable to fetch account');
				}
				connectRTM();
				navigation.navigate('Main');
			} catch (err) {
				this.logger.log('Error happened while fetching');
				this.changeScreen(LOGIN_SCREENS.ERROR);
			}
		} else {
			this.changeScreen(LOGIN_SCREENS.AUTH_HOME);
		}
	}

	async _forceLogin() {
		await AsyncStorage.removeItem('token');
		await this._tryAuth();
	}

	changeScreen(screen: LOGIN_SCREENS) {
		this.setState({
			activeScreen: screen
		});
	}

	// async createAccount() {
	// 	const { number, fullName, callingCode, gender, dob, photoUrl } = this.state;
	// 	const invalidParam = [number, fullName, callingCode, gender, dob, photoUrl].filter(p => !p);
	// 	if (invalidParam.length) {
	// 		return simpleAlert('Required', 'Please provide all required information');
	// 	}
	// 	// may be create account
	// 	try {
	// 		this.changeScreen(LOGIN_SCREENS.VERIFYING);
	// 		const pendingAccount: PendingAccount = (await ApiRequest(API.ACCOUNT.MAYBE_CREATE, {
	// 			phoneNumber: `${callingCode}-${number}`,
	// 			fullName: fullName,
	// 			photoUrl: photoUrl,
	// 			dob,
	// 			gender
	// 		})) as PendingAccount;

	// 		if (!isEmpty(pendingAccount)) {
	// 			await setAccountRequestFromPendingAccount(pendingAccount);
	// 			return this.changeScreen(LOGIN_SCREENS.REVIEW);
	// 		}
	// 	} catch (er) {
	// 		// if error on pending request, account most
	// 		// likely already there
	// 		simpleAlert('Login', 'Try login using your phone number', () =>
	// 			this.changeScreen(LOGIN_SCREENS.LOGIN_SIGNUP)
	// 		);
	// 	}
	// }

	// async sendVerificationSMS(shouldLogin: boolean = false) {
	// 	if (!(await isSmsAllowed())) {
	// 		return simpleAlert(
	// 			'Limit exceeded',
	// 			'You exceeded your limit to verify phone number. Please try again tomorrow.'
	// 		);
	// 	}
	// 	const { number, fullName, callingCode } = this.state;

	// 	let error = '';
	// 	this.logger.log(number, fullName);

	// 	if (number && String(number).length < 6) {
	// 		error = 'Please provide valid phone number';
	// 	}

	// 	if (number && String(number).length > 10) {
	// 		error = 'Please use number without calling-code';
	// 	}

	// 	if (shouldLogin) {
	// 		if (!number) {
	// 			error = 'Please provide phone number';
	// 		}
	// 	} else {
	// 		if (!number && !fullName) {
	// 			error = 'Please provide phone number & your name';
	// 		} else if (!number) {
	// 			error = 'Please provide phone number';
	// 		} else if (!fullName) {
	// 			error = 'Please provide your name';
	// 		}
	// 	}

	// 	if (error) {
	// 		simpleAlert('', error);
	// 	} else {
	// 		const phoneNumber = `${callingCode}-${number}`;
	// 		simpleAlert(
	// 			'Verification',
	// 			`Are you sure you want to verify +${phoneNumber}?`,
	// 			() => {
	// 				ApiRequest(API.OTP.SEND, {
	// 					phoneNumber
	// 				})
	// 					.then((response: any) => {
	// 						markSmsSent();
	// 						this.logger.log('OTP', response);
	// 						this.setState({
	// 							otp: response.code,
	// 							activeScreen: LOGIN_SCREENS.VERIFY
	// 						});
	// 					})
	// 					.catch((err: any) => {
	// 						this.logger.log('OTP error ', err);
	// 						simpleAlert('Error', 'Unable to process');
	// 					});
	// 			},
	// 			true
	// 		);
	// 	}
	// }

	renderError() {
		return (
			<View>
				<Text style={styles.disabledText}>Make sure you have Internet</Text>
				<View style={{ paddingBottom: 16, paddingTop: 16 }}>
					<Button label="Retry" onPress={() => this._tryAuth()} />
				</View>
				<Button label="Try Login" onPress={this._forceLogin} />
			</View>
		);
	}

	getPermissionAsync = async () => {
		if (IS_IOS) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				simpleAlert(
					'Need Permission',
					'Sorry, we need camera roll permissions to make this work!'
				);
				return false;
			}
		}
		return true;
	};

	onSignUpPress() {
		const { navigation } = this.props;
		navigation.navigate('Register');
	}

	render() {
		const { activeScreen } = this.state;
		if (activeScreen === LOGIN_SCREENS.AUTH_HOME) {
			return <AuthHome onSignUpPress={this.onSignUpPress} onLoginPress={noop} />;
		}

		return (
			<SafeAreaView style={GlobalStyle.expand}>
				<StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
				<KeyboardAvoidingView
					behavior={IS_IOS ? 'padding' : 'height'}
					style={styles.container}
				>
					{activeScreen === LOGIN_SCREENS.ERROR && this.renderError()}
				</KeyboardAvoidingView>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1
	},
	formContainer: {
		padding: 10,
		flexDirection: 'column',
		width: Layout.window.width
	},
	fieldContainer: {
		backgroundColor: Colors.borderColor,
		flexDirection: 'row',
		padding: 10,
		borderRadius: 20,
		margin: 10
	},
	countryContainer: {
		padding: 10,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	},
	callingCodeValue: {
		padding: 8
	},
	choiceField: {
		borderColor: Colors.borderColor,
		borderWidth: 1,

		marginTop: 8,
		marginBottom: 8,
		borderRadius: 4,

		flexDirection: 'column',
		justifyContent: 'center'
	},
	textInput: {
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10,
		color: Colors.black,
		flex: 1,
		textAlign: 'center'
	},
	tos: {
		color: Colors.offWhite,
		fontSize: 14,
		paddingBottom: 8,
		paddingLeft: 4,
		paddingRight: 4
	},
	paymentPlanTablet: {
		backgroundColor: 'white',
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		margin: 10,
		borderRadius: 10
	},
	price: {
		fontSize: 20
	},
	logo: {
		height: 100,
		margin: 10,
		marginTop: 0,
		resizeMode: 'contain'
	},
	disabledText: {
		color: Colors.offWhite
	}
});

function mapDispatchToProps(dispatch: any) {
	return {
		logAccount: bindActionCreators(logAccount, dispatch),
		fetchAccountByToken: bindActionCreators(fetchAccountByToken, dispatch),
		fetchAccount: bindActionCreators(fetchAccount, dispatch),
		connectRTM: bindActionCreators(connectRTM, dispatch)
	};
}

export default connect<any, any>(
	null,
	mapDispatchToProps
)(Auth);
