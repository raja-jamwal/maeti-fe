import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../button/button';
import { map, isNumber, forEach, noop } from 'lodash';
import { TextInput } from 'react-native-gesture-handler';
import GlobalStyle from 'src/styles/global';
import Color from 'src/constants/Colors';
import CountryPicker, { CCA2Code } from 'react-native-country-picker-modal';
import { isSmsAllowed, ApiRequest, markSmsSent } from '../../utils/index';
import { simpleAlert } from '../alert/index';
import { API } from 'src/config/API.ts';
import { getLogger } from '../../utils/logger';
import { connect } from 'react-redux';
import { IOtpState, defaultOtpState, setOtpState, setOtp } from '../../store/reducers/otp-reducer';
import { IRootState } from '../../store/index';
import { Dispatch, bindActionCreators } from 'redux';
import { NavigationInjectedProps } from 'react-navigation';
import { Throbber } from '../throbber/throbber';
import { SafeAreaView } from 'react-native-safe-area-context';

function SlowAppear({ children }: any) {
	const [secondsLeft, setSecondsLeft] = React.useState(2 * 60);
	React.useEffect(() => {
		const timer = setInterval(() => {
			if (secondsLeft <= 0) {
				clearInterval(timer);
			} else {
				setSecondsLeft(s => s - 1);
			}
		}, 1 * 1000);
		return () => {
			if (timer) {
				clearInterval(timer);
			}
		};
	}, []);
	if (secondsLeft > 0) {
		return (
			<Text style={{ textAlign: 'center', margin: 4 }}>
				Please wait for {secondsLeft}s before retrying
			</Text>
		);
	}
	return children;
}

interface ISmsEmailVerificationInnerProps {
	otpState: IOtpState;
	setOtpState: (state: IOtpState) => any;
	setOtp: (number: number) => any;
}

const defaultProps = {
	otpState: defaultOtpState,
	setOtpState: noop,
	setOtp: noop
};

function SmsEmailVerificationInner({
	otpState,
	setOtpState,
	setOtp,
	navigation
}: ISmsEmailVerificationInnerProps & NavigationInjectedProps = defaultProps) {
	const inputs = {
		'1': {
			value: React.useState(''),
			ref: null
		},
		'2': {
			value: React.useState(''),
			ref: null
		},
		'3': {
			value: React.useState(''),
			ref: null
		},
		'4': {
			value: React.useState(''),
			ref: null
		}
	};
	const logger = getLogger(SmsEmailVerification);
	const [cca, setCca] = React.useState(otpState.cca);
	const [callingCode, setCallingCode] = React.useState(otpState.callingCode);
	const [number, setNumber] = React.useState(otpState.number);
	const [onVerificationCalled, setOnVerificationCalled] = React.useState(false);
	const otp = otpState.otp;

	const getOtp = (): number => {
		const stringDigits: string[] = [];
		forEach(inputs, input => {
			const [text, _setText] = input.value;
			stringDigits.push(!!text ? text : '');
		});
		const stringValue = stringDigits.join('');
		return parseInt(stringValue);
	};

	const sendVerificationSMS = async () => {
		if (!(await isSmsAllowed())) {
			return simpleAlert(
				'Limit exceeded',
				'You exceeded your limit to verify phone number. Please try again tomorrow.'
			);
		}

		let error = '';

		if (!number) {
			error = 'Please provide phone number';
		}

		if (number && String(number).length < 6) {
			error = 'Please provide valid phone number';
		}

		if (number && String(number).length > 10) {
			error = 'Please use number without calling-code';
		}

		if (error) {
			simpleAlert('', error);
		} else {
			const phoneNumber = `${callingCode}-${number}`;
			simpleAlert(
				'Verification',
				`Are you sure you want to verify +${phoneNumber}?`,
				() => {
					ApiRequest(API.OTP.SEND, {
						phoneNumber
					})
						.then((response: any) => {
							// TODO: uncomment this
							// markSmsSent();
							logger.log('OTP', response);
							setOtp(response.code);
							setOtpState({
								cca,
								callingCode,
								number,
								otp: response.code
							});
						})
						.catch((err: any) => {
							logger.log('OTP error ', err);
							simpleAlert('Error', 'Unable to process');
						});
				},
				true
			);
		}
	};

	const verifyFunc = async () => {
		if (!otp) simpleAlert('Error', 'Unable to process');
		if (otp === getOtp()) {
			// call the top level function maybe
			const onVerification = navigation.getParam('onVerification', null);
			if (!onVerification) return;
			setOnVerificationCalled(true);
			try {
				const a = await onVerification(otpState);
			} catch (er) {
				logger.log(er);
			} finally {
				setOnVerificationCalled(false);
			}
			return;
		}

		simpleAlert('Incorrect OTP', 'Make sure you provide correct OTP');
	};

	return (
		<SafeAreaView style={styles.container}>
			{!otp && (
				<View>
					<Text style={{ textAlign: 'center' }}>
						Provide a valid phone number to verify your identity. Maeti will send a OTP
						on your phone number.
					</Text>
					<View
						style={[styles.fieldContainer, GlobalStyle.row, GlobalStyle.justifyCenter]}
					>
						<CountryPicker
							closeable={true}
							filterable={true}
							showCallingCode={true}
							cca2={cca as CCA2Code}
							onChange={value => {
								setCca(value.cca2);
								setCallingCode(parseInt(value.callingCode));
							}}
						/>
						<Text style={{ fontSize: 18, paddingLeft: 8 }}>+{callingCode}</Text>
						<TextInput
							defaultValue={number ? `${number}` : ''}
							style={styles.textInput}
							onChangeText={setNumber}
							keyboardType="numeric"
							placeholder="Your phone number"
						/>
					</View>
					<Button label="Verify" onPress={sendVerificationSMS} />
				</View>
			)}
			{!!otp && !onVerificationCalled && (
				<View>
					<Text style={{ textAlign: 'center' }}>
						Provide the OTP sent to +{callingCode}-{number} to confirm your identity
					</Text>
					<View style={[GlobalStyle.row, { margin: 10 }]}>
						{map(inputs, (input, i) => {
							const [text, setText] = input.value;
							return (
								<TextInput
									key={i}
									value={text}
									ref={r => (input.ref = r)}
									onChangeText={digit => {
										setText(digit);
										let inputRef;
										if (!!digit && isNumber(parseInt(digit))) {
											inputRef = inputs[`${1 + parseInt(i)}`];
										}
										if (!digit) {
											inputRef = inputs[`${parseInt(i) - 1}`];
										}
										if (inputRef) {
											inputRef.ref.focus();
										}
									}}
									maxLength={1}
									keyboardType="numeric"
									style={styles.input}
								/>
							);
						})}
					</View>
					<SlowAppear>
						<Button label="Change Phone Number" onPress={() => setOtp(0)} />
					</SlowAppear>
					<Button
						isPrimary={true}
						style={{ marginTop: 12 }}
						label="Confirm"
						onPress={() => verifyFunc()}
					/>
				</View>
			)}
			{!!otp && onVerificationCalled && <Throbber size="large" />}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		margin: 16
	},
	input: {
		flex: 1,
		borderColor: Color.borderColor,
		color: Color.black,
		borderWidth: 1,
		margin: 5,
		paddingTop: 5,
		paddingBottom: 5,
		borderRadius: 5,
		fontSize: 18,
		textAlign: 'center'
	},
	fieldContainer: {
		backgroundColor: Color.borderColor,
		flexDirection: 'row',
		padding: 10,
		borderRadius: 20,
		margin: 10
	},
	textInput: {
		marginLeft: 10,
		marginRight: 10,
		borderRadius: 10,
		paddingRight: 10,
		color: Color.black,
		flex: 1,
		fontSize: 18
	}
});

export const SmsEmailVerification = connect(
	(state: IRootState) => {
		return {
			otpState: state.otp
		};
	},
	(dispatch: Dispatch<any>) => {
		return {
			setOtpState: bindActionCreators(setOtpState, dispatch),
			setOtp: bindActionCreators(setOtp, dispatch)
		};
	}
)(SmsEmailVerificationInner);

SmsEmailVerification['navigationOptions'] = ({ navigation }: any) => {
	return {
		title: 'Verification'
	};
};
