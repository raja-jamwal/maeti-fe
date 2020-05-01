import * as React from 'react';
import { Platform, Keyboard, EmitterSubscription } from 'react-native';
import { View, Text } from 'react-native';

class TabBarComponent extends React.Component {
	state = {
		visible: true
	};

	keyboardEventListeners: EmitterSubscription[] = [];

	componentDidMount() {
		if (Platform.OS === 'android') {
			this.keyboardEventListeners = [
				Keyboard.addListener('keyboardDidShow', this.visible(false)),
				Keyboard.addListener('keyboardDidHide', this.visible(true))
			];
		}
	}

	componentWillUnmount() {
		this.keyboardEventListeners &&
			this.keyboardEventListeners.forEach(eventListener => eventListener.remove());
	}

	visible = (visible: boolean) => () => this.setState({ visible });

	render() {
		if (!this.state.visible) {
			return null;
		} else {
			return (
				<View>
					<Text>Hello</Text>
				</View>
			);
		}
	}
}

export default TabBarComponent;
