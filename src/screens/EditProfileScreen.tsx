import * as React from 'react';
import {
	DatePickerAndroid,
	EmitterSubscription,
	Keyboard,
	Modal,
	Picker,
	Platform,
	ScrollView,
	StatusBar,
	StyleSheet,
	TextInput,
	TimePickerAndroid,
	TouchableNativeFeedback,
	View
} from 'react-native';
import GlobalStyles from '../styles/global';
import Text, { Value } from '../components/text/index';
import TagSelector from '../components/tag-selector/tag-selector';
import { Tag } from '../store/reducers/account-defination';
import { Throbber } from '../components/throbber/throbber';
import { getLogger } from '../utils/logger';
import { formatDate, formatDateTime } from '../utils';
import { Country, getAllCountries } from 'react-native-country-picker-modal';
import { find } from 'lodash';
import RNPickerSelect from 'react-native-picker-select';
import { WORLD_OPTION, WorldSelectorField } from '../components/world-selector';
import Color from '../constants/Colors';
import AboutField from '../components/about-field';

const CustomProgressBar = ({ visible, label = 'Saving' }) => (
	<Modal onRequestClose={() => null} visible={visible}>
		<StatusBar backgroundColor={Color.white} barStyle="dark-content" />
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
	showSubmissionFooter: boolean;
}

export default class EditProfileScreen extends React.Component<any, IEditProfileScreenState> {
	static navigationOptions = ({ navigation }) => {
		const title = navigation.getParam('title', 'Information');
		return {
			title: `Edit ${title}`
		};
	};

	logger = getLogger(EditProfileScreen);

	keyboardEventListeners: EmitterSubscription[] = [];

	constructor(props: any) {
		super(props);
		const { object, mapping } = this.getObjectAndMapping();
		this.state = {
			object: object,
			showProgress: false,
			mapping: mapping,
			showSubmissionFooter: true
		};
	}

	componentDidMount() {
		if (Platform.OS === 'android') {
			this.keyboardEventListeners = [
				Keyboard.addListener('keyboardDidShow', this.showSubmissionFooter(false)),
				Keyboard.addListener('keyboardDidHide', this.showSubmissionFooter(true))
			];
		}
	}

	componentWillUnmount() {
		this.keyboardEventListeners &&
			this.keyboardEventListeners.forEach(eventListener => eventListener.remove());
	}

	showSubmissionFooter(showSubmissionFooter: boolean) {
		return () => this.setState({ showSubmissionFooter });
	}

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
			const isAboutField = type === 'about';
			const isStringField = type === 'string';
			const isChoiceField = type === 'choice';
			const isNumberField = type === 'number';
			const isDateField = type === 'date';
			const isDateTimeField = type === 'date-time';
			const isCountryField = type === 'country';
			const isStateField = type === 'state';
			const isCityField = type === 'city';
			const isTagArray = type === 'tag-array';
			const tagType = isTagArray && fieldDefinition.tagType;

			let renderString = null;
			let stringEditable = false;

			let renderWorldValue = '';

			switch (type) {
				case 'about':
				case 'string':
					renderString = value && value.toString();
					stringEditable = true;
					break;
				case 'bool':
					renderString = value ? 'Yes' : 'No';
					stringEditable = false;
					break;
				case 'country':
				case 'state':
				case 'city':
					renderWorldValue = (value && value.name) || '';
					break;
				default:
					renderString = value;
					break;
			}

			const choiceOptions = isChoiceField && fieldDefinition.choice.options;

			return (
				<View key={field}>
					<Value style={styles.fieldLabel}>{fieldDefinition.label}</Value>
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
					{isAboutField && (
						<AboutField
							value={renderString}
							onChangeText={text => this.updateFieldValue(field, text)}
						/>
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
								{!renderString && <Text style={styles.label}>&nbsp;</Text>}
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
								{!renderString && <Text style={styles.label}>&nbsp;</Text>}
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
							<RNPickerSelect
								value={value}
								useNativeAndroidPickerStyle={true}
								onValueChange={itemValue => this.updateFieldValue(field, itemValue)}
								items={choiceOptions}
							/>
						</View>
					)}
					{isCountryField && (
						<WorldSelectorField
							options={[WORLD_OPTION.COUNTRY]}
							onSelect={selection => {
								if (!selection || !selection.country) {
									return;
								}
								this.updateFieldValue(field, selection.country);
							}}
							value={renderWorldValue}
						/>
					)}
					{isStateField && (
						<WorldSelectorField
							options={[WORLD_OPTION.COUNTRY, WORLD_OPTION.STATE]}
							onSelect={selection => {
								if (!selection || !selection.state) {
									return;
								}
								this.updateFieldValue(field, selection.state);
							}}
							value={renderWorldValue}
						/>
					)}
					{isCityField && (
						<WorldSelectorField
							options={[WORLD_OPTION.COUNTRY, WORLD_OPTION.STATE, WORLD_OPTION.CITY]}
							onSelect={selection => {
								if (!selection || !selection.city) {
									return;
								}
								this.updateFieldValue(field, selection.city);
							}}
							value={renderWorldValue}
						/>
					)}
				</View>
			);
		});
		return <View style={styles.formGroup}>{fields}</View>;
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
		const { showProgress, showSubmissionFooter } = this.state;
		return (
			<View style={GlobalStyles.expand}>
				<StatusBar backgroundColor={Color.white} barStyle="dark-content" />
				<ScrollView style={[GlobalStyles.expand, styles.formContainer]}>
					{this.renderFields()}
				</ScrollView>
				{showProgress && <CustomProgressBar visible={true} />}
				{showSubmissionFooter && (
					<View style={styles.submissionFooter}>
						<TouchableNativeFeedback onPress={() => this.updateInformation()}>
							<Text style={styles.submissionBtn}>Update Information</Text>
						</TouchableNativeFeedback>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	formContainer: {
		padding: 8,
		paddingTop: 0
	},
	formGroup: {
		paddingBottom: 30
	},
	fieldLabel: {
		paddingTop: 14,
		paddingBottom: 4,
		fontSize: 16
	},
	fieldText: {
		height: 35,
		fontSize: 16
	},
	textField: {
		borderColor: Color.borderColor,
		borderWidth: 1,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 6,
		paddingBottom: 6,
		borderRadius: 4
	},
	choiceField: {
		borderColor: Color.borderColor,
		borderWidth: 1,
		paddingLeft: 2,
		borderRadius: 4
	},
	submissionFooter: {
		backgroundColor: 'white',
		padding: 8,
		borderTopWidth: 1,
		borderColor: Color.tabIconDefault
	},
	submissionBtn: {
		backgroundColor: Color.primaryDarkColor,
		padding: 6,
		textAlign: 'center',
		color: 'white',
		margin: 4,
		borderRadius: 4,
		fontSize: 16
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
