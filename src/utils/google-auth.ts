import * as GoogleSignIn from 'expo-google-sign-in';

/**
 * Init Google Auth, Make sure this is called in native view thread
 */
export async function initAuth() {
	try {
		await GoogleSignIn.initAsync();
	} catch (err) {}
}

export const attemptGoogleLogin = async (): Promise<GoogleSignIn.GoogleUser | null> => {
	try {
		await GoogleSignIn.askForPlayServicesAsync();
		const { type, user } = await GoogleSignIn.signInAsync();
		if (type === 'success') {
			// const email = googleUser.email;
			// const accessToken = googleUser.auth?.accessToken;
			// const refreshToken = googleUser.auth?.refreshToken;
			// const expire = googleUser.auth?.accessTokenExpirationDate;
			const googleUser = await GoogleSignIn.signInSilentlyAsync();
			return googleUser;
		}
		return null;
	} catch ({ message }) {
		throw message;
	}
};
