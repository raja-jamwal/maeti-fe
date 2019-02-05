import React from 'react';
import {
	TextInput,
	TouchableNativeFeedback,
	StyleSheet,
	ScrollView,
	View,
	Picker
} from 'react-native';
import ProfileInfoTab from '../components/profile-info-tab';
import GlobalStyles from '../styles/global';
import Text from '../components/text';
import Colors from '../constants/Colors';
import _ from 'lodash';

export default class EditProfileScreen extends React.Component {
	static navigationOptions = ({ navigation }) => {
		const title = navigation.getParam('title', 'Information');
		return {
			title: `Edit ${title}`
		};
	};

	getObjectAndMapping() {
		const { navigation } = this.props;
		const object = navigation.getParam('object', {});
		const mapping = navigation.getParam('mapping', {});
		return {
			object,
			mapping
		};
	}

	renderFields() {
		const { object, mapping } = this.getObjectAndMapping();
		// console.warn(mapping);
		const fields = Object.keys(mapping).map(field => {
			const fieldDefinition = mapping[field];
			const value = object[field];
			if (!value) return null;
			const stringValue = (_.isString(value) && value) || 'not a string';
			const isChoiceField = fieldDefinition.choice;
			const choiceOptions = isChoiceField && fieldDefinition.choice.options;
			return (
				<View key={field}>
					<Text style={styles.fieldLabel}>{fieldDefinition.label}</Text>
					{!isChoiceField && (
						<View style={styles.textField}>
							<TextInput style={styles.fieldText} value={stringValue} />
						</View>
					)}
					{isChoiceField && (
						<View style={styles.choiceField}>
							<Picker
								selectedValue={null}
								onValueChange={(itemValue, itemIndex) => null}
							>
								{choiceOptions.map(option => (
									<Picker.Item
										key={option.value}
										label={option.label}
										value={option.value}
									/>
								))}
							</Picker>
						</View>
					)}
				</View>
			);
		});
		return <View>{fields}</View>;
	}

	render() {
		return (
			<View style={GlobalStyles.expand}>
				<ScrollView style={[GlobalStyles.expand, styles.formContainer]}>
					{this.renderFields()}
				</ScrollView>
				<View style={styles.submissionFooter}>
					<TouchableNativeFeedback onPress={() => null}>
						<Text style={styles.submissionBtn}>Update Information</Text>
					</TouchableNativeFeedback>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	formContainer: {
		padding: 8,
		paddingTop: 0
	},
	fieldLabel: {
		paddingTop: 14,
		paddingBottom: 4
	},
	fieldText: {
		height: 35,
		fontSize: 18
	},
	textField: {
		borderColor: Colors.borderColor,
		borderWidth: 1,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 6,
		paddingBottom: 6,
		borderRadius: 4
	},
	choiceField: {
		borderColor: Colors.borderColor,
		borderWidth: 1,
		paddingLeft: 2,
		borderRadius: 4
	},
	submissionFooter: {
		backgroundColor: 'white',
		padding: 8,
		borderTopWidth: 1,
		borderColor: Colors.tabIconDefault
	},
	submissionBtn: {
		backgroundColor: Colors.pink,
		padding: 4,
		textAlign: 'center',
		color: 'white',
		margin: 4,
		borderRadius: 4,
		fontSize: 18
	}
});
