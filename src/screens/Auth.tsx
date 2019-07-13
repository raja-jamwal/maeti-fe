import * as React from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableNativeFeedback,
	View
} from 'react-native';
import GlobalStyle from '../styles/global';
import { connect } from 'react-redux';
import Colors from '../constants/Colors';
import CountryPicker, { FlagType } from 'react-native-country-picker-modal';
import Layout from '../constants/Layout';

interface IAuthProps {}

interface IAuthDispatchProps {
	createAccount: () => any;
}

class Auth extends React.Component<IAuthProps & IAuthDispatchProps, any> {
	constructor(props: any) {
		super(props);
		this.buttonClicked = this.buttonClicked.bind(this);
		this.state = {
			cca: 'IN',
			callingCode: 91,
			activeScreen: 'signup',
			number: null,
			fullName: null
		};
	}

	buttonClicked() {
		console.log(this.props.createAccount());
	}

	changeScreen(screen: string) {
		this.setState({
			activeScreen: screen
		});
	}

	sendVerificationSMS() {
		const { number, fullName } = this.state;
		let error = '';
		console.log(number, fullName);
		if (!number && !fullName) {
			error = 'Please provide phone number & your name';
		} else if (!number) {
			error = 'Please provide phone number';
		} else if (!fullName) {
			error = 'Please provide your name';
		}

		if (error) {
			Alert.alert('', error, [{ text: 'OK', onPress: () => null }], { cancelable: true });
		} else {
			this.setState({
				activeScreen: 'verify'
			});
		}
	}

	renderSignUp() {
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
									callingCode: value.callingCode
								});
							}}
						/>
					</View>
					<View style={styles.fieldContainer}>
						<TextInput
							defaultValue={this.state.number}
							style={styles.textInput}
							onChange={e => {
								this.setState({ number: e.nativeEvent.text });
							}}
							keyboardType="numeric"
							placeholder="Your mobile number"
						/>
					</View>
					<View style={styles.fieldContainer}>
						<TextInput
							defaultValue={this.state.fullName}
							style={styles.textInput}
							onChange={e => {
								this.setState({ fullName: e.nativeEvent.text });
							}}
							spellCheck={false}
							placeholder="Your name"
						/>
					</View>
					<TouchableNativeFeedback onPress={() => this.sendVerificationSMS()}>
						<Text style={styles.verifyBtn}>Sign up</Text>
					</TouchableNativeFeedback>
				</View>
			</View>
		);
	}

	validateVerificationCode(code: string) {
		if (!code) return;
		if (code.length === 4) {
			this.setState({
				activeScreen: 'verifying'
			});
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
					<TouchableNativeFeedback onPress={() => this.changeScreen('signup')}>
						<Text style={styles.verifyBtn}>Change Phone Number</Text>
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
				<TouchableNativeFeedback onPress={() => this.changeScreen('signup')}>
					<Text style={styles.verifyBtn}>Create Account</Text>
				</TouchableNativeFeedback>
			</View>
		);
	}

	render() {
		const { activeScreen } = this.state;
		return (
			<View style={[GlobalStyle.expand, styles.container]}>
				<StatusBar hidden={true} />
				<Image source={require('../assets/images/icon.png')} style={styles.logo} />
				{activeScreen === 'signup' && this.renderSignUp()}
				{activeScreen === 'verify' && this.renderVerificationScreen()}
				{activeScreen === 'verifying' && <ActivityIndicator color="white" />}
				{activeScreen === 'plans' && this.renderPlans()}
				<Text style={styles.tos}>
					Copyright (c) 2019 DataGrid Softwares LLP. All rights reserved. Use of this
					software is under Terms and conditions
				</Text>
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
	verifyBtn: {
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
		// createAccount: bindActionCreators(createAccount, dispatch)
	};
}

export default connect<any, any>(
	null,
	mapDispatchToProps
)(Auth);
