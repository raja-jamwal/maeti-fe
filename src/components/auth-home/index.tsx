import * as React from 'react';
import { View, Text, StatusBar, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Screen from '../../constants/Layout';
import GlobalStyle from 'src/styles/global';
import Button from '../button/button';
import { TosModal } from '../tos-modal/tos-modal';
import * as AppAuth from 'expo-app-auth';
import * as GoogleSignIn from 'expo-google-sign-in';
import { simpleAlert } from '../alert/index';

const { URLSchemes } = AppAuth;

var advertImage = require('../../assets/login/advert.jpg');
var up1 = require('../../assets/login/up1.png');
var up2 = require('../../assets/login/up2.png');
var up3 = require('../../assets/login/up3.png');

export function AuthHome() {
	const [showEula, setShowEula] = React.useState(false);
	const [showPolicy, setShowPolicy] = React.useState(false);
	const toggleEula = () => setShowEula(!showEula);
	const togglePolicy = () => setShowPolicy(!showPolicy);

	const [user, setUser] = React.useState((null as any) as (GoogleSignIn.GoogleUser | null));

	const syncUserWithStateAsync = async () => {
		const googleUser = await GoogleSignIn.signInSilentlyAsync();
		simpleAlert('user', JSON.stringify(googleUser));
		setUser(googleUser);
	};

	const initAuth = async () => {
		try {
			await GoogleSignIn.initAsync();
		} catch (err) {}
	};

	React.useEffect(() => {
		initAuth();
	}, []);

	const attemptLogin = async () => {
		try {
			await GoogleSignIn.askForPlayServicesAsync();
			const { type, user } = await GoogleSignIn.signInAsync();
			if (type === 'success') {
				syncUserWithStateAsync();
			}
		} catch ({ message }) {
			simpleAlert('error', message);
		}
	};

	return (
		<View style={[GlobalStyle.expand, styles.bg]}>
			<StatusBar hidden={true} />
			<ImageBackground source={advertImage} style={styles.advert}>
				<View style={[GlobalStyle.expand, GlobalStyle.columnReverse]}>
					<ImageBackground source={up3} style={[styles.login, { height: 120 }]}>
						<View
							style={[
								GlobalStyle.row,
								GlobalStyle.justifyCenter,
								GlobalStyle.alignCenter
							]}
						>
							<Text style={[styles.text, { marginRight: 8 }]}>
								Already have an account?
							</Text>
							<Button
								style={styles.btnContainer}
								labelStyle={styles.text}
								label="Login"
								onPress={() => null}
							/>
						</View>
						<View style={{ padding: 20 }}>
							<View style={[GlobalStyle.alignCenter, GlobalStyle.justifyCenter]}>
								<Text style={styles.tos}>
									By signing in or registering. I agree to
								</Text>
								<View style={GlobalStyle.row}>
									<TouchableOpacity onPress={toggleEula}>
										<Text style={styles.tos}>Terms of Use</Text>
									</TouchableOpacity>
									<Text style={styles.tos}>&nbsp;|&nbsp;</Text>
									<TouchableOpacity onPress={togglePolicy}>
										<Text style={styles.tos}>Privacy Policy</Text>
									</TouchableOpacity>
								</View>
							</View>
							<TosModal
								showModal={showEula}
								isEula={true}
								toggleShowModal={toggleEula}
							/>
							<TosModal
								showModal={showPolicy}
								isEula={false}
								toggleShowModal={togglePolicy}
							/>
						</View>
					</ImageBackground>
					<ImageBackground source={up2} style={[styles.login, { height: 100 }]} />
					<ImageBackground
						source={up1}
						style={[styles.login, { width: 1125, height: 378 }]}
					>
						<View
							style={[
								GlobalStyle.expand,
								GlobalStyle.row,
								{
									width: Screen.window.width,
									marginBottom: -60
								}
							]}
						>
							<View
								style={[
									GlobalStyle.columnReverse,
									GlobalStyle.alignCenter,
									GlobalStyle.expand
								]}
							>
								<Button
									style={styles.signupBtnContainer}
									labelStyle={[styles.text, { fontSize: 16 }]}
									onPress={attemptLogin}
									label="Sign up Free"
								/>
								<Text style={[styles.text, { marginBottom: 8 }]}>
									New to Maeti?
								</Text>
								<Text style={[styles.text, { fontSize: 25, marginBottom: 28 }]}>
									Sindhi Rishta
								</Text>
								<Text style={[styles.text, { fontSize: 25, marginBottom: 2 }]}>
									Sindhyun lae
								</Text>
							</View>
						</View>
					</ImageBackground>
				</View>
			</ImageBackground>
		</View>
	);
}

const styles = StyleSheet.create({
	signupBtnContainer: {
		backgroundColor: 'rgb(41, 187, 207)',
		borderRadius: 50,
		padding: 10
	},
	btnContainer: {
		backgroundColor: 'transparent',
		borderColor: 'white',
		borderWidth: 1,
		borderRadius: 50
	},
	tos: {
		color: 'white',
		fontSize: 12,
		paddingRight: 4
	},
	text: {
		color: 'white',
		paddingLeft: 8,
		paddingRight: 8,
		fontWeight: 'bold'
	},
	login: {
		width: Screen.window.width,
		height: 300
	},
	bg: {
		backgroundColor: 'black'
	},
	advert: {
		width: Screen.window.width,
		height: Screen.window.height,
		resizeMode: 'contain'
	}
});
