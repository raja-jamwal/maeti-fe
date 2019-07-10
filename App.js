import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon, Permissions, Notifications } from 'expo';
import AppNavigator from './src/navigation/AppNavigator';
import { connect, Provider } from 'react-redux';
import { store } from './src/store';
import { fetchAccount } from './src/store/reducers/account-reducer';
import { bindActionCreators } from 'redux';

const styles = StyleSheet.create({
	container: {
		flex: 1
		// backgroundColor: '#fff'
	}
});

class App extends React.Component {
	state = {
		isLoadingComplete: false
	};

	componentDidMount() {
		// check for local token
		// if token is there
		// pull account from BE
		// others set to
	}

	render() {
		if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
			return (
				<AppLoading
					startAsync={this._loadResourcesAsync}
					onError={this._handleLoadingError}
					onFinish={this._handleFinishLoading}
				/>
			);
		} else {
			return (
				<View style={styles.container}>
					{Platform.OS === 'ios' && <StatusBar barStyle="default" />}
					<AppNavigator />
				</View>
			);
		}
	}

	_loadAccount = function() {
		console.log('loading account');
		return new Promise((resolve, reject) => {
			this.props.fetchAccount();
			resolve('yeahd');
		});
	};

	_getNotificationPerm = async function() {};

	_loadResourcesAsync = async () => {
		return Promise.all([
			Asset.loadAsync([
				require('./src/assets/images/robot-dev.png'),
				require('./src/assets/images/robot-prod.png')
			]),
			Font.loadAsync({
				// This is the font that we are using for our tab bar
				...Icon.Ionicons.font,
				// We include SpaceMono because we use it in HomeScreen.js. Feel free
				// to remove this if you are not using it in your app
				'space-mono': require('./src/assets/fonts/SpaceMono-Regular.ttf'),
				'comfortaa-bold': require('./src/assets/fonts/Comfortaa-Bold.ttf'),
				'comfortaa-light': require('./src/assets/fonts/Comfortaa-Light.ttf'),
				'comfortaa-regular': require('./src/assets/fonts/Comfortaa-Regular.ttf')
			}),
			this._loadAccount(),
			this._getNotificationPerm()
		]);
	};

	_handleLoadingError = error => {
		// In this case, you might want to report the error to your error
		// reporting service, for example Sentry
		console.warn(error);
	};

	_handleFinishLoading = () => {
		this.setState({ isLoadingComplete: true });
	};
}

const mapDispatchToProps = function(dispatch) {
	return {
		fetchAccount: bindActionCreators(fetchAccount, dispatch)
	};
};

const ConnectedApp = connect(
	null,
	mapDispatchToProps
)(App);

export default class AppContainer extends React.Component {
	render() {
		return (
			<Provider store={store}>
				<ConnectedApp {...this.props} />
			</Provider>
		);
	}
}
