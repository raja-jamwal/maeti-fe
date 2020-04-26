import { Alert } from 'react-native';

export const simpleAlert = (title: string, message: string, onPress?: () => void) => {
	return Alert.alert(
		title,
		message,
		[
			{
				text: 'OK',
				onPress: () => {
					if (onPress) {
						return onPress();
					}
					return null;
				}
			}
		],
		{ cancelable: true }
	);
};
