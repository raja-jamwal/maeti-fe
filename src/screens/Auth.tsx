import * as React from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
	Image,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native';
import GlobalStyle from '../styles/global';
import { connect } from 'react-redux';
import Colors from '../constants/Colors';
import CountryPicker, { CCA2Code } from 'react-native-country-picker-modal';
import Layout from '../constants/Layout';
import { ApiRequest, IS_IOS } from '../utils';
import { API } from '../config/API';
import { simpleAlert } from '../components/alert';
import { Account } from '../store/reducers/account-defination';
import { bindActionCreators } from 'redux';
import { fetchAccount } from '../store/reducers/account-reducer';
import { NavigationInjectedProps } from 'react-navigation';
import { getLogger } from '../utils/logger';
import { connectRTM } from '../store/middleware/rtm-middleware';
import Button from '../components/button/button';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';

interface IAuthDispatchProps {
	fetchAccount: (id: string) => any;
	connectRTM: () => any;
}

enum LOGIN_SCREENS {
	LOGIN_SIGNUP,
	SIGNUP,
	VERIFY,
	VERIFYING,
	PICK_IMAGE,
	PLANS,
	ERROR
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
	fullName: string | null;
	gender: string;
	otp: number | null;
	action: ACTION;
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
			gender: 'male',
			otp: null,
			action: ACTION.LOGIN
		};

		this._tryAuth = this._tryAuth.bind(this);
		this._forceLogin = this._forceLogin.bind(this);
		this._startPhotoUpload = this._startPhotoUpload.bind(this);
	}

	async componentDidMount() {
		await this._tryAuth();
	}

	async _tryAuth() {
		const { fetchAccount, navigation, connectRTM } = this.props;
		// Just in case we want to for - re - login
		// await AsyncStorage.removeItem('accountId');
		const accountId = await AsyncStorage.getItem('accountId');
		this.logger.log(`accountId from storage ${accountId}`);

		if (accountId) {
			try {
				const account = await fetchAccount(accountId);
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
			this.changeScreen(LOGIN_SCREENS.LOGIN_SIGNUP);
		}
	}

	async _forceLogin() {
		await AsyncStorage.removeItem('accountId');
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

	sendVerificationSMS(shouldLogin: boolean = false) {
		const { number, fullName, callingCode } = this.state;

		let error = '';
		this.logger.log(number, fullName);

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
					const account: Account = (await ApiRequest(API.ACCOUNT.GET, {
						phoneNumber: `${callingCode}-${number}`
					})) as Account;
					await AsyncStorage.setItem('accountId', `${account.id}`);
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
		const { number, fullName, callingCode, gender } = this.state;
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
					const account: Account = (await ApiRequest(API.ACCOUNT.CREATE, {
						phoneNumber: `${callingCode}-${number}`,
						fullName: fullName,
						photoUrl: uploadedImage.url,
						gender
					})) as Account;
					await AsyncStorage.setItem('accountId', `${account.id}`);
					await this._tryAuth();
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

	renderUploadPhoto() {
		const { gender } = this.state;
		return (
			<View>
				<Button label="Upload your Best Photo" onPress={this._startPhotoUpload} />
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
								height: 50,
								padding: 8,
								fontSize: 16
							}
						}}
					/>
				</View>
			</View>
		);
	}

	render() {
		const { activeScreen } = this.state;
		return (
			<View style={[GlobalStyle.expand, styles.container]}>
				<Image source={require('../assets/images/icon.png')} style={styles.logo} />
				{activeScreen === LOGIN_SCREENS.LOGIN_SIGNUP && this.renderSignUp(true)}
				{activeScreen === LOGIN_SCREENS.SIGNUP && this.renderSignUp()}
				{activeScreen === LOGIN_SCREENS.VERIFY && this.renderVerificationScreen()}
				{activeScreen === LOGIN_SCREENS.PICK_IMAGE && this.renderUploadPhoto()}
				{activeScreen === LOGIN_SCREENS.VERIFYING && (
					<ActivityIndicator color={Colors.primaryDarkColor} />
				)}
				{activeScreen === LOGIN_SCREENS.PLANS && this.renderPlans()}
				{activeScreen === LOGIN_SCREENS.ERROR && this.renderError()}
				{!!activeScreen && activeScreen !== LOGIN_SCREENS.ERROR && (
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
		backgroundColor: Colors.white,
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
		backgroundColor: Colors.borderColor,
		flexDirection: 'row',
		padding: 10,
		borderRadius: 20,
		margin: 10
	},
	countryContainer: {
		padding: 10
	},
	choiceField: {
		borderColor: Colors.borderColor,
		borderWidth: 1,

		marginTop: 8,
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
		marginTop: 0,
		resizeMode: 'contain'
	},
	disabledText: {
		color: Colors.offWhite
	}
});

function mapDispatchToProps(dispatch: any) {
	return {
		fetchAccount: bindActionCreators(fetchAccount, dispatch),
		connectRTM: bindActionCreators(connectRTM, dispatch)
	};
}

export default connect<any, any>(
	null,
	mapDispatchToProps
)(Auth);
