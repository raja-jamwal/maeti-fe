import * as React from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
	Image,
	StyleSheet,
	Text,
	TextInput,
	TouchableNativeFeedback,
	View
} from 'react-native';
import GlobalStyle from '../styles/global';
import { connect } from 'react-redux';
import Colors from '../constants/Colors';
import CountryPicker, { CCA2Code } from 'react-native-country-picker-modal';
import Layout from '../constants/Layout';
import { ApiRequest } from '../utils';
import { API } from '../config/API';
import { simpleAlert } from '../components/alert';
import { Account } from '../store/reducers/account-defination';
import { bindActionCreators } from 'redux';
import { fetchAccount } from '../store/reducers/account-reducer';
import { NavigationInjectedProps } from 'react-navigation';
import { getLogger } from '../utils/logger';

interface IAuthDispatchProps {
	fetchAccount: (id: string) => any;
}

enum LOGIN_SCREENS {
	LOGIN_SIGNUP = 'login-signup',
	LOGIN = 'login',
	SIGNUP = 'signup',
	VERIFY = 'verify',
	VERIFYING = 'verifying',
	PLANS = 'plans'
}

interface IAuthState {
	cca: CCA2Code;
	callingCode: number;
	activeScreen: LOGIN_SCREENS | null;
	number: number | null;
	fullName: string | null;
	otp: number | null;
}

type IAuthProps = NavigationInjectedProps & IAuthDispatchProps;

class Auth extends React.Component<IAuthProps, IAuthState> {
	private logger = getLogger(Auth);

	constructor(props: IAuthProps) {
		super(props);
		this.state = {
			cca: 'IN',
			callingCode: 91,
			activeScreen: null,
			number: null,
			fullName: null,
			otp: null
		};
		this._tryAuth = this._tryAuth.bind(this);
	}

	async componentDidMount() {
		await this._tryAuth();
	}

	async _tryAuth() {
		const { fetchAccount, navigation } = this.props;
		// Just in case we want to for - re - login
		// await AsyncStorage.removeItem('accountId');
		const accountId = await AsyncStorage.getItem('accountId');

		this.logger.log(`accountId from storage ${accountId}`);

		if (accountId) {
			fetchAccount(accountId);
			navigation.navigate('Main');
		} else {
			this.changeScreen(LOGIN_SCREENS.LOGIN_SIGNUP);
		}
	}

	changeScreen(screen: LOGIN_SCREENS) {
		this.setState({
			activeScreen: screen
		});
	}

	sendVerificationSMS(shouldLogin: boolean = false) {
		const { number, fullName, callingCode } = this.state;
		let error = '';
		this.logger.log(number, fullName);
		if (!number && !fullName) {
			error = 'Please provide phone number & your name';
		} else if (!number) {
			error = 'Please provide phone number';
		} else if (!fullName) {
			error = 'Please provide your name';
		}

		if (error) {
			simpleAlert('', error);
		} else {
			ApiRequest(API.OTP.SEND, {
				phoneNumber: `${callingCode}${number}`
			})
				.then((response: any) => {
					this.logger.log('OTP', response);
					this.setState({
						otp: response.code,
						activeScreen: LOGIN_SCREENS.VERIFY
					});
				})
				.catch((err: any) => {
					this.logger.log('OTP error ', err);
					simpleAlert('Error', 'Unable to process');
				});
		}
	}

	renderSignUp(login: boolean = false) {
		const { number, fullName } = this.state;
		return (
			<View>
				<View style={styles.formContainer}>
					<View style={styles.countryContainer}>
						<CountryPicker
							closeable={false}
							filterable={true}
							showCallingCode={true}
							cca2={this.state.cca}
							onChange={value => {
								this.setState({
									cca: value.cca2,
									callingCode: parseInt(value.callingCode)
								});
							}}
						/>
					</View>
					<View style={styles.fieldContainer}>
						<TextInput
							defaultValue={number ? `${number}` : ''}
							style={styles.textInput}
							onChange={e => {
								this.setState({ number: parseInt(e.nativeEvent.text) });
							}}
							keyboardType="numeric"
							placeholder="Your mobile number"
						/>
					</View>
					{!login && (
						<View style={styles.fieldContainer}>
							<TextInput
								defaultValue={fullName || ''}
								style={styles.textInput}
								onChange={e => {
									this.setState({ fullName: e.nativeEvent.text });
								}}
								spellCheck={false}
								placeholder="Your name"
							/>
						</View>
					)}
					{login && (
						<View>
							<TouchableNativeFeedback onPress={() => this.sendVerificationSMS(true)}>
								<Text style={styles.btn}>Login</Text>
							</TouchableNativeFeedback>
							<TouchableNativeFeedback
								onPress={() => this.changeScreen(LOGIN_SCREENS.SIGNUP)}
							>
								<Text style={styles.btn}>New User</Text>
							</TouchableNativeFeedback>
						</View>
					)}
					{!login && (
						<TouchableNativeFeedback onPress={() => this.sendVerificationSMS()}>
							<Text style={styles.btn}>Sign up</Text>
						</TouchableNativeFeedback>
					)}
				</View>
			</View>
		);
	}

	validateVerificationCode(passedInCode: string) {
		const { otp, number, fullName } = this.state;
		if (!passedInCode) return;
		const code = parseInt(passedInCode);
		if (passedInCode.length === 4) {
			if (code === otp) {
				this.setState({
					activeScreen: LOGIN_SCREENS.VERIFYING
				});

				ApiRequest(API.ACCOUNT.CREATE, {
					phoneNumber: number,
					fullName: fullName
				})
					.then(async (response: Account) => {
						await AsyncStorage.setItem('accountId', `${response.id}`);
						await this._tryAuth();
					})
					.catch((err: any) => {
						this.logger.log('account create error ', err);
						simpleAlert('Error', 'Unable to create your account');
						this.changeScreen(LOGIN_SCREENS.SIGNUP);
					});
			} else {
				simpleAlert('Invalid OTP', 'Please provide valid OTP');
			}
		}
	}

	renderVerificationScreen() {
		return (
			<View>
				<View style={styles.formContainer}>
					<View style={styles.fieldContainer}>
						<TextInput
							style={styles.textInput}
							onChange={e => this.validateVerificationCode(e.nativeEvent.text)}
							keyboardType="numeric"
							placeholder="Enter verification code sent in SMS"
						/>
					</View>
					<TouchableNativeFeedback
						onPress={() => this.changeScreen(LOGIN_SCREENS.SIGNUP)}
					>
						<Text style={styles.btn}>Change Phone Number</Text>
					</TouchableNativeFeedback>
				</View>
			</View>
		);
	}

	renderPlans() {
		return (
			<View>
				<View style={styles.formContainer}>
					<View style={styles.paymentPlanTablet}>
						<Text style={[styles.price, styles.disabledText]}>
							₹ 1,200/yr - Silver Plan
						</Text>
					</View>
					<View style={styles.paymentPlanTablet}>
						<Text style={[styles.price, styles.disabledText]}>
							₹ 1,500/yr - Bronze Plan
						</Text>
					</View>
					<View style={styles.paymentPlanTablet}>
						<Text style={styles.price}>₹ 1,800/yr - Gold Plan</Text>
						<Text> FREE for you</Text>
					</View>
				</View>
				<TouchableNativeFeedback onPress={() => this.changeScreen(LOGIN_SCREENS.SIGNUP)}>
					<Text style={styles.btn}>Create Account</Text>
				</TouchableNativeFeedback>
			</View>
		);
	}

	render() {
		const { activeScreen } = this.state;
		return (
			<View style={[GlobalStyle.expand, styles.container]}>
				{/*<StatusBar hidden={true} />*/}
				<Image source={require('../assets/images/icon.png')} style={styles.logo} />
				{activeScreen === LOGIN_SCREENS.LOGIN_SIGNUP && this.renderSignUp(true)}
				{activeScreen === LOGIN_SCREENS.SIGNUP && this.renderSignUp()}
				{activeScreen === LOGIN_SCREENS.VERIFY && this.renderVerificationScreen()}
				{activeScreen === LOGIN_SCREENS.VERIFYING && <ActivityIndicator color="white" />}
				{activeScreen === LOGIN_SCREENS.PLANS && this.renderPlans()}
				{!!activeScreen && (
					<Text style={styles.tos}>
						Copyright (c) 2019 DataGrid Softwares LLP. All rights reserved. Use of this
						software is under Terms and conditions
					</Text>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.primaryDarkColor,
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	formContainer: {
		padding: 10,
		flexDirection: 'column',
		width: Layout.window.width
	},
	fieldContainer: {
		backgroundColor: Colors.tintColor,
		flexDirection: 'row',
		padding: 10,
		borderRadius: 20,
		margin: 10
	},
	countryContainer: {
		padding: 10
	},
	textInput: {
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 10,
		paddingLeft: 10,
		paddingRight: 10,
		color: 'white',
		flex: 1,
		textAlign: 'center'
	},
	btn: {
		backgroundColor: Colors.pink,
		padding: 10,
		textAlign: 'center',
		color: 'white',
		margin: 10,
		borderRadius: 4,
		fontSize: 18
	},
	tos: {
		textAlign: 'center',
		color: Colors.offWhite,
		fontSize: 10,
		padding: 15
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
		resizeMode: 'contain'
	},
	disabledText: {
		color: Colors.offWhite
	}
});

function mapDispatchToProps(dispatch: any) {
	return {
		fetchAccount: bindActionCreators(fetchAccount, dispatch)
	};
}

export default connect<any, any>(
	null,
	mapDispatchToProps
)(Auth);
