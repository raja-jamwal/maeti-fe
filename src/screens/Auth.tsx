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
import { IS_IOS, ApiRequest } from '../utils';
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
import { fetchTags } from '../store/reducers/tag-reducer';
import { Account } from '../store/reducers/account-defination';
import { API } from '../config/API';
import { IOtpState } from '../store/reducers/otp-reducer';

interface IAuthDispatchProps {
	fetchAccount: (id: string) => any;
	fetchAccountByToken: (token: string) => any;
	logAccount: () => any;
	fetchTags: () => any;
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
		this.onLoginPress = this.onLoginPress.bind(this);
	}

	async componentDidMount() {
		// modelRepository.delete();
		this.props.fetchTags();
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

	onLoginPress() {
		const { navigation } = this.props;

		navigation.navigate('LoginVerification', {
			onVerification: (otpState: IOtpState) => {
				return new Promise(async (resolve, reject) => {
					try {
						const account: Account = (await ApiRequest(API.AUTH.SIGNIN, {
							phoneNumber: `${otpState.callingCode}-${otpState.number}`,
							otpCode: otpState.otp
						})) as Account;
						await AsyncStorage.setItem('token', `${account.token}`);
						await this._tryAuth();
						resolve('done');
					} catch (er) {
						this.logger.log('account login error ', er);
						simpleAlert('Error', `Unable to log-in`);
						resolve('');
					}
				});
			}
		});
	}

	render() {
		const { activeScreen } = this.state;
		if (activeScreen === LOGIN_SCREENS.AUTH_HOME) {
			return <AuthHome onSignUpPress={this.onSignUpPress} onLoginPress={this.onLoginPress} />;
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
		fetchTags: bindActionCreators(fetchTags, dispatch),
		fetchAccountByToken: bindActionCreators(fetchAccountByToken, dispatch),
		fetchAccount: bindActionCreators(fetchAccount, dispatch),
		connectRTM: bindActionCreators(connectRTM, dispatch)
	};
}

export default connect<any, any>(
	null,
	mapDispatchToProps
)(Auth);
