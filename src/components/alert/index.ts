import { Alert } from 'react-native';

export const simpleAlert = (
	title: string,
	message: string,
	onPress?: () => void,
	showCancelBtn?: boolean
) => {
	const btns = [];
	if (showCancelBtn) {
		btns.push({
			text: 'Cancel',
			onPress: () => null
		});
	}
	btns.push({
		text: 'OK',
		onPress: () => {
			if (onPress) {
				return onPress();
			}
			return null;
		}
	});
	return Alert.alert(title, message, btns, { cancelable: true });
};

export const simplePrompt = (title: string, message: string, onPress?: () => void) => {
	return Alert.alert(
		title,
		message,
		[
			{
				text: 'Cancel',
				onPress: () => null
			},
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
