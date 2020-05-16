import * as React from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
	Image,
	StyleSheet,
	Text,
	TextInput,
	View,
	StatusBar,
	DatePickerAndroid,
	KeyboardAvoidingView,
	TouchableOpacity
} from 'react-native';
import GlobalStyle from '../styles/global';
import { connect } from 'react-redux';
import Colors from '../constants/Colors';
import CountryPicker, { CCA2Code } from 'react-native-country-picker-modal';
import Layout from '../constants/Layout';
import { ApiRequest, IS_IOS, formatDate } from '../utils';
import { API } from '../config/API';
import { simpleAlert } from '../components/alert';
import { Account, PendingAccount } from '../store/reducers/account-defination';
import { bindActionCreators } from 'redux';
import { fetchAccount, fetchAccountByToken } from '../store/reducers/account-reducer';
import { NavigationInjectedProps } from 'react-navigation';
import { getLogger } from '../utils/logger';
import { connectRTM } from '../store/middleware/rtm-middleware';
import Button from '../components/button/button';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import AppTour from 'src/components/app-tour/app-tour';
import { Throbber } from '../components/throbber/throbber';
import { isEmpty, noop } from 'lodash';
import {
	setAccountRequestFromPendingAccount,
	getAccountRequest,
	removeAccountRequest
} from '../utils/account-request';
import DateTimeIos from 'src/components/date-time-ios/date-time-ios';
import { SafeAreaView } from 'react-native';
import { TosModal } from 'src/components/tos-modal/tos-modal';

interface IAuthDispatchProps {
	fetchAccount: (id: string) => any;
	fetchAccountByToken: (token: string) => any;
	connectRTM: () => any;
}

enum LOGIN_SCREENS {
	TOUR,
	LOGIN_SIGNUP,
	SIGNUP,
	VERIFY,
	VERIFYING,
	PICK_IMAGE,
	PLANS,
	ERROR,
	REVIEW
}

enum ACTION {
	SIGN_UP,
	LOGIN
}

interface IAuthState {
	cca: CCA2Code;
	callingCode: number;
	activeScreen: LOGIN_SCREENS | null;
	number: number | null;
	photoUrl: string;
	fullName: string | null;
	dob: string;
	gender: string;
	otp: number | null;
	action: ACTION;
	showEula: boolean;
	showPolicy: boolean;
}

type IAuthProps = NavigationInjectedProps & IAuthDispatchProps;

function TryLogin({ changeScreen }: { changeScreen: (screen: LOGIN_SCREENS) => any }) {
	const logger = getLogger(TryLogin);
	const [isChecking, setIsChecking] = React.useState(false);
	const [isSubmitted, setIsSubmitted] = React.useState(false);

	const tryRequesting = async () => {
		setIsChecking(true);
		try {
			const { phoneNumber, fullName, photoUrl, dob, gender } = await getAccountRequest();
			await ApiRequest(API.ACCOUNT.MAYBE_CREATE, {
				phoneNumber,
				fullName: fullName,
				photoUrl,
				dob,
				gender
			});
			setIsSubmitted(true);
		} catch (er) {
			logger.log(er);
			return setTimeout(() => changeScreen(LOGIN_SCREENS.LOGIN_SIGNUP));
		}
		setIsChecking(false);
		return changeScreen(LOGIN_SCREENS.REVIEW);
	};
	return (
		<View
			style={{
				paddingTop: 16,
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			{isChecking && <Throbber size="small" />}
			{!isChecking && isSubmitted && (
				<Text style={{ color: Colors.offWhite }}>Account is still under review</Text>
			)}
			{!isChecking && (
				<View style={{ flexDirection: 'row' }}>
					<Button style={btnStyles.btn} label="Try Login" onPress={tryRequesting} />
					<Button
						style={btnStyles.btn}
						label="Update Request"
						onPress={() => {
							setTimeout(() => changeScreen(LOGIN_SCREENS.SIGNUP));
						}}
					/>
				</View>
			)}
		</View>
	);
}

const btnStyles = StyleSheet.create({
	btn: {
		margin: 8
	}
});

function DateOfBirth(
	{ setDob, dob }: { setDob: (epoch: number) => any; dob: string } = { setDob: noop, dob: '' }
) {
	// handle case for ios
	if (IS_IOS) {
		let date = new Date(1970, 0, 1);
		if (!!dob) {
			// unix epoch to ts
			date = new Date(parseInt(dob) * 1000);
		}
		return (
			<DateTimeIos
				epoch={date.getTime() / 1000}
				dateOnly={true}
				field={'field'}
				updateFieldValue={(_field: any, epoch: number) => setDob(epoch)}
			/>
		);
	}

	// handle case for android
	const AndroidDateTime = async () => {
		try {
			const { action, year, month, day } = await DatePickerAndroid.open({
				date: new Date(1993, 0, 1)
			});
			if (action !== DatePickerAndroid.dismissedAction) {
				const date = new Date(year, month, day);
				// epoch in seconds
				const ts = Math.floor(date.getTime() / 1000);
				setDob(ts);
			}
		} catch (err) {}
	};

	const renderedString = (!!dob && formatDate(parseInt(dob))) || 'Choose Date Of Birth';
	return <Button label={renderedString} onPress={AndroidDateTime} />;
}

class Auth extends React.Component<IAuthProps, IAuthState> {
	private logger = getLogger(Auth);

	constructor(props: IAuthProps) {
		super(props);
		this.state = {
			cca: 'IN',
			callingCode: 91,
			activeScreen: null,
			number: null,
			photoUrl: '',
			fullName: null,
			dob: '',
			gender: 'male',
			otp: null,
			action: ACTION.LOGIN,
			showEula: false,
			showPolicy: false
		};

		this._tryAuth = this._tryAuth.bind(this);
		this._forceLogin = this._forceLogin.bind(this);
		this._startPhotoUpload = this._startPhotoUpload.bind(this);
		this.changeScreen = this.changeScreen.bind(this);
		this.skipTourScreen = this.skipTourScreen.bind(this);
		this.setDob = this.setDob.bind(this);
		this.createAccount = this.createAccount.bind(this);

		this.toggleEula = this.toggleEula.bind(this);
		this.togglePolicy = this.togglePolicy.bind(this);
	}

	async componentDidMount() {
		await this._tryAuth();
	}

	async _tryAuth() {
		const { fetchAccountByToken, navigation, connectRTM } = this.props;
		try {
			const accountRequest = await getAccountRequest();
			if (!isEmpty(accountRequest)) {
				this.logger.log('account request not empty ', accountRequest);
				return this.changeScreen(LOGIN_SCREENS.REVIEW);
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
			this.changeScreen(LOGIN_SCREENS.TOUR);
		}
	}

	async _forceLogin() {
		await AsyncStorage.removeItem('token');
		await this._tryAuth();
	}

	changeScreen(screen: LOGIN_SCREENS) {
		let action = ACTION.LOGIN;
		if (screen === LOGIN_SCREENS.SIGNUP) {
			action = ACTION.SIGN_UP;
		}

		this.setState({
			activeScreen: screen,
			action
		});
	}

	toggleEula() {
		const { showEula } = this.state;
		this.setState({ showEula: !showEula });
	}

	togglePolicy() {
		const { showPolicy } = this.state;
		this.setState({ showPolicy: !showPolicy });
	}

	async createAccount() {
		const { number, fullName, callingCode, gender, dob, photoUrl } = this.state;
		const invalidParam = [number, fullName, callingCode, gender, dob, photoUrl].filter(p => !p);
		if (invalidParam.length) {
			return simpleAlert('Required', 'Please provide all required information');
		}
		// may be create account
		try {
			this.changeScreen(LOGIN_SCREENS.VERIFYING);
			const pendingAccount: PendingAccount = (await ApiRequest(API.ACCOUNT.MAYBE_CREATE, {
				phoneNumber: `${callingCode}-${number}`,
				fullName: fullName,
				photoUrl: photoUrl,
				dob,
				gender
			})) as PendingAccount;

			if (!isEmpty(pendingAccount)) {
				await setAccountRequestFromPendingAccount(pendingAccount);
				return this.changeScreen(LOGIN_SCREENS.REVIEW);
			}
		} catch (er) {
			// if error on pending request, account most
			// likely already there
			simpleAlert('Login', 'Try login using your phone number', () =>
				this.changeScreen(LOGIN_SCREENS.LOGIN_SIGNUP)
			);
		}
	}

	sendVerificationSMS(shouldLogin: boolean = false) {
		const { number, fullName, callingCode } = this.state;

		let error = '';
		this.logger.log(number, fullName);

		if (number && String(number).length > 10) {
			error = 'Please use number without calling-code';
		}

		if (shouldLogin) {
			if (!number) {
				error = 'Please provide phone number';
			}
		} else {
			if (!number && !fullName) {
				error = 'Please provide phone number & your name';
			} else if (!number) {
				error = 'Please provide phone number';
			} else if (!fullName) {
				error = 'Please provide your name';
			}
		}

		if (error) {
			simpleAlert('', error);
		} else {
			ApiRequest(API.OTP.SEND, {
				phoneNumber: `${callingCode}-${number}`
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
		const { number, fullName, callingCode } = this.state;
		return (
			<View>
				<View style={styles.formContainer}>
					<View style={styles.countryContainer}>
						<CountryPicker
							closeable={true}
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
						<Text style={styles.callingCodeValue}>+{callingCode}</Text>
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
							<View style={{ paddingBottom: 16 }}>
								<Button
									label="Login"
									onPress={() => this.sendVerificationSMS(true)}
								/>
							</View>
							<Button
								label="New User"
								onPress={() => this.changeScreen(LOGIN_SCREENS.SIGNUP)}
							/>
						</View>
					)}
					{!login && (
						<Button label="Sign up" onPress={() => this.sendVerificationSMS()} />
					)}
				</View>
			</View>
		);
	}

	async validateVerificationCode(passedInCode: string) {
		const { otp, number, action, callingCode } = this.state;
		if (!passedInCode) return;
		const code = parseInt(passedInCode);
		if (passedInCode.length === 4) {
			if (code === otp) {
				this.setState({
					activeScreen: LOGIN_SCREENS.VERIFYING
				});
				if (action === ACTION.SIGN_UP) {
					return this.setState({
						activeScreen: LOGIN_SCREENS.PICK_IMAGE
					});
				}
				try {
					const account: Account = (await ApiRequest(API.AUTH.SIGNIN, {
						phoneNumber: `${callingCode}-${number}`,
						otpCode: code
					})) as Account;
					await AsyncStorage.setItem('token', `${account.token}`);
					await removeAccountRequest();
					await this._tryAuth();
				} catch (er) {
					this.logger.log('account create error ', er);
					simpleAlert(
						'Error',
						`Unable to ${action === ACTION.LOGIN ? 'log-in' : 'create your account'}`
					);
					this.changeScreen(LOGIN_SCREENS.SIGNUP);
				}
			} else {
				simpleAlert('Invalid OTP', 'Please provide valid OTP');
			}
		}
	}

	renderVerificationScreen() {
		const { action } = this.state;
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
					<Button
						label="Change Phone Number"
						onPress={() => {
							if (action === ACTION.SIGN_UP) {
								this.changeScreen(LOGIN_SCREENS.SIGNUP);
							} else {
								this.changeScreen(LOGIN_SCREENS.LOGIN_SIGNUP);
							}
						}}
					/>
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
				<Button
					label="Create Account"
					onPress={() => this.changeScreen(LOGIN_SCREENS.SIGNUP)}
				/>
			</View>
		);
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

	async _startPhotoUpload() {
		try {
			const permitted = await this.getPermissionAsync();
			if (permitted) {
				const image = await ImagePicker.launchImageLibraryAsync({
					mediaTypes: MediaTypeOptions.Images,
					allowsEditing: true,
					quality: 0.5,
					aspect: [4, 3]
				});
				if (!image.cancelled) {
					this.setState({
						activeScreen: LOGIN_SCREENS.VERIFYING
					});

					try {
						const uploadedImage = (await ApiRequest(API.PHOTO.UPLOAD, {
							file: {
								uri: image.uri,
								name: 'image.jpg',
								type: 'image/jpeg'
							}
						})) as any;
						if (!uploadedImage) {
							throw new Error('unable to upload photo');
						}

						this.setState({
							photoUrl: uploadedImage.url
						});
					} catch (er) {
						this.logger.log(er);
					} finally {
						this.setState({
							activeScreen: LOGIN_SCREENS.PICK_IMAGE
						});
					}
				}
			}
		} catch (err) {
			this.logger.log(err);
			simpleAlert(
				'Error',
				`Unable create account, please check if already created with existing number!`
			);
			this.setState({
				activeScreen: LOGIN_SCREENS.PICK_IMAGE
			});
		}
	}

	setDob(epoch: number) {
		if (!epoch) return;
		this.setState({
			dob: String(epoch)
		});
	}

	renderUploadPhoto() {
		const { gender, dob, photoUrl } = this.state;
		return (
			<View>
				<Button
					label={photoUrl ? '✅ Change photo' : 'Upload your Best Photo'}
					onPress={this._startPhotoUpload}
				/>
				<View style={styles.choiceField}>
					<RNPickerSelect
						value={gender}
						useNativeAndroidPickerStyle={false}
						onValueChange={itemValue => this.setState({ gender: itemValue })}
						items={[
							{
								label: 'Male',
								value: 'male'
							},
							{
								label: 'Female',
								value: 'female'
							}
						]}
						textInputProps={{
							style: {
								color: 'black',
								height: 40,
								padding: 8,
								fontSize: 16
							}
						}}
					/>
				</View>
				<View style={{ paddingBottom: 8 }}>
					<DateOfBirth setDob={this.setDob} dob={dob} />
				</View>
				<Button label="Create Account" onPress={this.createAccount} />
			</View>
		);
	}

	skipTourScreen() {
		this.setState({
			activeScreen: LOGIN_SCREENS.LOGIN_SIGNUP
		});
	}

	renderAccountReview() {
		return (
			<View
				style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
			>
				<Text style={{ color: Colors.offWhite, fontSize: 18, padding: 8 }}>
					Under Review
				</Text>
				<Text style={{ color: Colors.offWhite, fontSize: 16, padding: 4 }}>
					Your request is under review
				</Text>
				<Text style={{ color: Colors.offWhite, fontSize: 16, padding: 4 }}>
					We'll send you SMS when account is approved
				</Text>
				<Text style={{ color: Colors.offWhite, fontSize: 16, padding: 4 }}>
					For help WhatsApp on +91-73877-78673
				</Text>
				<TryLogin changeScreen={this.changeScreen} />
			</View>
		);
	}

	render() {
		const { activeScreen, showEula, showPolicy } = this.state;
		if (activeScreen === LOGIN_SCREENS.TOUR) {
			return <AppTour onSkip={this.skipTourScreen} />;
		}

		const year = new Date().getFullYear();

		return (
			<SafeAreaView style={GlobalStyle.expand}>
				<StatusBar backgroundColor={Colors.white} barStyle="dark-content" />

				<KeyboardAvoidingView
					behavior={IS_IOS ? 'padding' : 'height'}
					style={styles.container}
				>
					<Image source={require('../assets/images/icon.png')} style={styles.logo} />
					{activeScreen === LOGIN_SCREENS.LOGIN_SIGNUP && this.renderSignUp(true)}
					{activeScreen === LOGIN_SCREENS.SIGNUP && this.renderSignUp()}
					{activeScreen === LOGIN_SCREENS.VERIFY && this.renderVerificationScreen()}
					{activeScreen === LOGIN_SCREENS.PICK_IMAGE && this.renderUploadPhoto()}
					{activeScreen === LOGIN_SCREENS.VERIFYING && (
						<ActivityIndicator color={Colors.primaryDarkColor} />
					)}
					{activeScreen === LOGIN_SCREENS.REVIEW && this.renderAccountReview()}
					{activeScreen === LOGIN_SCREENS.PLANS && this.renderPlans()}
					{activeScreen === LOGIN_SCREENS.ERROR && this.renderError()}
				</KeyboardAvoidingView>
				{!!activeScreen && activeScreen !== LOGIN_SCREENS.ERROR && (
					<View style={[GlobalStyle.alignCenter, GlobalStyle.justifyCenter]}>
						<Text style={styles.tos}>By signing in or registering. I agree to</Text>
						<View style={GlobalStyle.row}>
							<TouchableOpacity onPress={this.toggleEula}>
								<Text style={styles.tos}>Terms of Use</Text>
							</TouchableOpacity>
							<Text style={styles.tos}>&nbsp;|&nbsp;</Text>
							<TouchableOpacity onPress={this.togglePolicy}>
								<Text style={styles.tos}>Privacy Policy</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
				<TosModal showModal={showEula} isEula={true} toggleShowModal={this.toggleEula} />
				<TosModal
					showModal={showPolicy}
					isEula={false}
					toggleShowModal={this.togglePolicy}
				/>
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
		fetchAccountByToken: bindActionCreators(fetchAccountByToken, dispatch),
		fetchAccount: bindActionCreators(fetchAccount, dispatch),
		connectRTM: bindActionCreators(connectRTM, dispatch)
	};
}

export default connect<any, any>(
	null,
	mapDispatchToProps
)(Auth);
