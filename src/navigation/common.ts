import { Platform } from 'react-native';
import Colors from '../constants/Colors';

export const defaultNavigationOptions = {
	headerStyle: {
		backgroundColor: 'white',
		...Platform.select({
			ios: {
				height: 100
			},
			android: {
				height: 50
			}
		})
	},
	headerTintColor: Colors.offWhite,
	headerTitleStyle: {
		fontWeight: 'normal',
		fontSize: 16
	},
	labelStyle: {
		fontSize: 8
	},
	cardStyle: { backgroundColor: 'white' }
};
