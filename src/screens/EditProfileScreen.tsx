import * as React from 'react';
import {
	TextInput,
	TouchableNativeFeedback,
	StyleSheet,
	ScrollView,
	View,
	Picker,
	Modal,
	DatePickerAndroid,
	TimePickerAndroid
} from 'react-native';
import GlobalStyles from '../styles/global';
import Text from '../components/text/index';
import Colors from '../constants/Colors';
import TagSelector from '../components/tag-selector/tag-selector';
import { Tag } from '../store/reducers/account-defination';
import { Throbber } from '../components/throbber/throbber';
import { getLogger } from '../utils/logger';
import Color from 'src/constants/Colors.js';
import { formatDate, formatDateTime } from '../utils';
import CountryPicker, { Country, getAllCountries } from 'react-native-country-picker-modal';
import { find } from 'lodash';

const CustomProgressBar = ({ visible, label = 'Saving' }) => (
	<Modal onRequestClose={() => null} visible={visible}>
		<View
			style={{
				flex: 1,
				backgroundColor: 'rgb(255, 255, 255)',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<View>
				<Text style={{ fontSize: 20, fontWeight: '200', marginBottom: 10 }}>{label}</Text>
				<Throbber size="large" />
			</View>
		</View>
	</Modal>
);

interface IEditProfileScreenState {
	object: any;
	showProgress: boolean;
	mapping: any;
}

export default class EditProfileScreen extends React.Component<any, IEditProfileScreenState> {
	static navigationOptions = ({ navigation }) => {
		const title = navigation.getParam('title', 'Information');
		return {
			title: `Edit ${title}`
		};
	};

	logger = getLogger(EditProfileScreen);

	constructor(props: any) {
		super(props);
		const { object, mapping } = this.getObjectAndMapping();
		this.state = {
			object: object,
			showProgress: false,
			mapping: mapping
		};
	}

	// componentWillReceiveProps(props: IEditProfileScreenState) {
	// 	console.log('EDIT_PROFILE recv props');
	// }

	getObjectAndMapping() {
		const { navigation } = this.props;
		const object = navigation.getParam('object', {});
		const mapping = navigation.getParam('mapping', {});
		return {
			object,
			mapping
		};
	}

	updateFieldValue(field: string, value: any) {
		if (field && value !== null) {
			const { object } = this.state;
			object[field] = value;
			this.setState({
				object: { ...object }
			});
		}
	}

	async setDateField(field: string) {
		try {
			const { action, year, month, day } = await DatePickerAndroid.open({
				date: new Date(1993, 0, 1)
			});
			if (action !== DatePickerAndroid.dismissedAction) {
				const date = new Date(year, month, day);
				// epoch in seconds
				const ts = Math.floor(date.getTime() / 1000);
				this.updateFieldValue(field, ts);
			}
		} catch (err) {
			this.logger.log(err);
		}
	}

	async setDateTimeField(field: string) {
		try {
			const { dateAction, year, month, day } = await DatePickerAndroid.open({
				date: new Date(1993, 0, 1)
			});
			if (dateAction === DatePickerAndroid.dismissedAction) return;
			const date = new Date(year, month, day);
			const { timeAction, hour, minute } = await TimePickerAndroid.open({});
			if (timeAction === TimePickerAndroid.dismissedAction) return;
			date.setHours(hour, minute, 0);
			// epoch in seconds
			const ts = Math.floor(date.getTime() / 1000);
			this.updateFieldValue(field, ts);
		} catch (err) {
			this.logger.log(err);
		}
	}

	getCcaCodeFromCallingCode(callingCode: number) {
		const allCountries = getAllCountries();
		const country: Country = find(allCountries, { callingCode: `${callingCode}` });
		if (!country) return null;
		return country.cca2;
	}

	renderCountryName(callingCode: number) {
		this.logger.log(callingCode);
		const allCountries = getAllCountries();
		const country: Country | null = find(allCountries, { callingCode: `${callingCode}` });
		if (!country) return null;
		return (country.name && country.name.common) || 'Unknown country';
	}

	renderFields() {
		const { object, mapping } = this.state;
		const fields = Object.keys(mapping).map(field => {
			const fieldDefinition = mapping[field];

			if (!fieldDefinition) return null;

			const value = object[field];
			// if (!value) return null;

			const type = fieldDefinition.type;

			const isBooleanField = type === 'bool';
			const isStringField = type === 'string';
			const isChoiceField = type === 'choice';
			const isNumberField = type === 'number';
			const isDateField = type === 'date';
			const isDateTimeField = type === 'date-time';
			const isCountryField = type === 'country';
			const isTagArray = type === 'tag-array';
			const tagType = isTagArray && fieldDefinition.tagType;

			let renderString = null;
			let stringEditable = false;

			switch (type) {
				case 'string':
					renderString = value && value.toString();
					stringEditable = true;
					break;
				case 'bool':
					renderString = value ? 'Yes' : 'No';
					stringEditable = false;
					break;
				default:
					renderString = value;
					break;
			}

			const choiceOptions = isChoiceField && fieldDefinition.choice.options;

			return (
				<View key={field}>
					<Text style={styles.fieldLabel}>{fieldDefinition.label}</Text>
					{isStringField && (
						<View style={styles.textField}>
							<TextInput
								onChangeText={text => this.updateFieldValue(field, text)}
								placeholder={fieldDefinition.label}
								value={renderString}
								style={styles.fieldText}
							/>
						</View>
					)}
					{isNumberField && (
						<View style={styles.textField}>
							<TextInput
								keyboardType="numeric"
								onChangeText={text => this.updateFieldValue(field, text)}
								placeholder={fieldDefinition.label}
								value={value && value.toString()}
								style={styles.fieldText}
							/>
						</View>
					)}
					{isTagArray && (
						<View>
							<TagSelector
								tagType={tagType}
								currentTags={value}
								updateTags={(tags: Array<Tag>) => {
									this.updateFieldValue(field, [].concat(tags));
								}}
								title={fieldDefinition.label}
							/>
						</View>
					)}
					{isBooleanField && (
						<View style={styles.choiceField}>
							<Picker
								selectedValue={!!value}
								onValueChange={itemValue => this.updateFieldValue(field, itemValue)}
							>
								<Picker.Item key="no" label="No" value={false} />
								<Picker.Item key="yes" label="Yes" value={true} />
							</Picker>
						</View>
					)}
					{isDateField && (
						<TouchableNativeFeedback onPress={() => this.setDateField(field)}>
							<View style={styles.labelContainer}>
								{!renderString && <Text style={styles.label}>No Set</Text>}
								{!!renderString && (
									<Text style={styles.label}>
										{formatDate(parseInt(renderString))}
									</Text>
								)}
							</View>
						</TouchableNativeFeedback>
					)}
					{isDateTimeField && (
						<TouchableNativeFeedback onPress={() => this.setDateTimeField(field)}>
							<View style={styles.labelContainer}>
								{!renderString && <Text style={styles.label}>No Set</Text>}
								{!!renderString && (
									<Text style={styles.label}>
										{formatDateTime(parseInt(renderString))}
									</Text>
								)}
							</View>
						</TouchableNativeFeedback>
					)}
					{isChoiceField && (
						<View style={styles.choiceField}>
							<Picker
								selectedValue={value}
								onValueChange={itemValue => this.updateFieldValue(field, itemValue)}
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
					{isCountryField && (
						<CountryPicker
							closeable={true}
							filterable={true}
							showCallingCode={false}
							cca2={
								(renderString && this.getCcaCodeFromCallingCode(renderString)) ||
								'IN'
							}
							onChange={value => {
								if (value && value.callingCode) {
									this.updateFieldValue(field, parseInt(value.callingCode));
								}
							}}
						>
							<View style={styles.labelContainer}>
								<Text style={styles.label}>
									{this.renderCountryName(renderString) || 'Choose country'}
								</Text>
							</View>
						</CountryPicker>
					)}
				</View>
			);
		});
		return <View>{fields}</View>;
	}

	async updateInformation() {
		// fire updateAction with userProfileId
		// wait for it to resolve
		// show activity indicator meanwhile
		// on error show error modal
		// on success close & go back
		const { navigation } = this.props;
		const { object } = this.state;
		const updateAction = navigation.getParam('updateAction', null);
		const userProfileId = navigation.getParam('userProfileId', null);

		if (!userProfileId || !updateAction) {
			return;
		}

		this.setState({
			showProgress: true
		});

		if (!updateAction || !userProfileId) return null;
		await updateAction({ userProfileId, object });

		this.setState({
			showProgress: false
		});

		navigation.goBack();
	}

	render() {
		const { showProgress } = this.state;
		return (
			<View style={GlobalStyles.expand}>
				<ScrollView style={[GlobalStyles.expand, styles.formContainer]}>
					{this.renderFields()}
				</ScrollView>
				{showProgress && <CustomProgressBar visible={true} />}
				<View style={styles.submissionFooter}>
					<TouchableNativeFeedback onPress={() => this.updateInformation()}>
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
	},
	labelContainer: {
		borderColor: Color.borderColor,
		borderStyle: 'solid',
		borderWidth: 1,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 4
	},
	label: {
		fontSize: 16
	}
});
