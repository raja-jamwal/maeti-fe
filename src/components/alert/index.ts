import { Alert } from 'react-native';

export const simpleAlert = (title: string, message: string) => {
	return Alert.alert(title, message, [{ text: 'OK', onPress: () => null }], { cancelable: true });
};
