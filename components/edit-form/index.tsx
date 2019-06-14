import * as React from 'react';
import {
	TextInput,
	TouchableNativeFeedback,
	StyleSheet,
	ScrollView,
	View,
	Picker,
	NativeSyntheticEvent,
	TextInputChangeEventData
} from 'react-native';

import GlobalStyles from '../../styles/global';
import Text from '../../components/text';
import Colors from '../../constants/Colors';
import * as _ from 'lodash';

interface IEditFormProps {
	object?: any;
	mapping: any;
	buttonLabel?: string;
	onUpdate: (model: any) => void;
}

interface IEditFormState {
	form: any;
}

export default class EditForm extends React.Component<IEditFormProps, IEditFormState> {
	constructor(props: IEditFormProps) {
		super(props);
		this.state = {
			form: _.cloneDeep(props.object)
		};
		this.onTextValueChange = this.onTextValueChange.bind(this);
		this.onPickerValueChange = this.onPickerValueChange.bind(this);
		this.onUpdateClicked = this.onUpdateClicked.bind(this);
	}

	onTextValueChange(fieldName: string) {
		return (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
			this.setState({
				form: {
					...this.state.form,
					[fieldName]: e.nativeEvent.text
				}
			});
		};
	}

	onPickerValueChange(fieldName: string) {
		return (value: string) => {
			this.setState({
				form: {
					...this.state.form,
					[fieldName]: value
				}
			});
		};
	}

	onUpdateClicked() {
		const { form } = this.state;
		const { onUpdate } = this.props;
		onUpdate(form);
	}

	renderFields() {
		const { mapping } = this.props;
		const object = this.state['form'];
		if (!object) return null;

		const fields = Object.keys(mapping).map(field => {
			const fieldDefinition = mapping[field];
			const value = object[field];
			// if (!value) return null;
			const stringValue = (_.isString(value) && value) || '';
			const isStringField =
				fieldDefinition.type === 'string' || fieldDefinition.type === 'about';
			const isChoiceField = fieldDefinition.choice;
			const choiceOptions = isChoiceField && fieldDefinition.choice.options;
			return (
				<View key={field}>
					<Text style={styles.fieldLabel}>{fieldDefinition.label}</Text>
					{!isChoiceField && isStringField && (
						<View style={styles.textField}>
							<TextInput
								onChange={this.onTextValueChange(field)}
								style={styles.fieldText}
								value={stringValue}
							/>
						</View>
					)}
					{isChoiceField && (
						<View style={styles.choiceField}>
							<Picker
								selectedValue={value}
								onValueChange={this.onPickerValueChange(field)}
							>
								{choiceOptions.map((option: any) => (
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
		const { buttonLabel } = this.props;
		return (
			<View style={GlobalStyles.expand}>
				<ScrollView style={[GlobalStyles.expand, styles.formContainer]}>
					{this.renderFields()}
				</ScrollView>
				<View style={styles.submissionFooter}>
					<TouchableNativeFeedback onPress={() => null}>
						<Text style={styles.submissionBtn}>
							{!buttonLabel && 'Update Information'}
							{buttonLabel}
						</Text>
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
