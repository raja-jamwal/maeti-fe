import { StyleSheet } from 'react-native';
import Colors from 'src/constants/Colors';

export default StyleSheet.create({
	expand: {
		flex: 1
	},
	row: {
		flexDirection: 'row'
	},
	rowReverse: {
		flexDirection: 'row-reverse'
	},
	column: {
		flexDirection: 'column'
	},
	columnReverse: {
		flexDirection: 'column-reverse'
	},
	large: {
		fontSize: 14
	},
	bold: {
		fontWeight: '500',
		color: Colors.black
	},
	textRegular: {
		fontSize: 12,
		color: Colors.offWhite
	},
	justifyCenter: {
		justifyContent: 'center'
	},
	alignCenter: {
		alignItems: 'center'
	},
	rightPaddedValue: {
		paddingRight: 5
	},
	padding: {
		padding: 16
	},
	paddedRight: {
		paddingRight: 5
	},
	paddedContainer: {
		padding: 4
	}
});
