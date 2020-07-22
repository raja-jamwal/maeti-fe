import * as React from 'react';
import { View, Text, StatusBar, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import Screen from '../../constants/Layout';
import GlobalStyle from 'src/styles/global';
import Button from '../button/button';
import { TosModal } from '../tos-modal/tos-modal';
// import { attemptGoogleLogin, initAuth } from '../../utils/google-auth';
// import { simpleAlert } from '../alert/index';
import { noop } from 'lodash';

var advertImage = require('../../assets/login/advert.jpg');
var up1 = require('../../assets/login/up1.png');
var up2 = require('../../assets/login/up2.png');
var up3 = require('../../assets/login/up3.png');

interface IAuthHomeProps {
	onSignUpPress: () => any;
	onLoginPress: () => any;
}

const defaultAuthHomeProps: IAuthHomeProps = {
	onSignUpPress: noop,
	onLoginPress: noop
};

export function AuthHome({ onSignUpPress, onLoginPress }: IAuthHomeProps = defaultAuthHomeProps) {
	const [showEula, setShowEula] = React.useState(false);
	const [showPolicy, setShowPolicy] = React.useState(false);
	const toggleEula = () => setShowEula(!showEula);
	const togglePolicy = () => setShowPolicy(!showPolicy);

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
								onPress={onLoginPress}
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
									onPress={onSignUpPress}
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
