import * as React from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView } from 'react-native';
import { formatDate, formatDateTime, IS_ANDROID, IS_IOS } from '../../utils';
import Colors from 'src/constants/Colors';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
interface IDateTimeIosProps {
	epoch: number;
	dateOnly: boolean;
	field: string;
	updateFieldValue: (field: string, unix: number) => any;
}

interface IDateTimeIosState {
	showModal: boolean;
	showAndroidDatePicker: boolean;
	showAndroidTimePicker: boolean;
	date: Date;
}

export default class DateTime extends React.PureComponent<IDateTimeIosProps, IDateTimeIosState> {
	constructor(props: IDateTimeIosProps) {
		super(props);
		this.state = {
			showModal: false,
			showAndroidDatePicker: false,
			showAndroidTimePicker: false,
			date: this.getDefaultDate(this.props.epoch || 0)
		};
		this.toggleModal = this.toggleModal.bind(this);
		this.openModal = this.openModal.bind(this);
	}

	getDefaultDate(epoch: number) {
		if (!epoch) return new Date(1993, 0, 1);
		return new Date(epoch * 1000); // unix time to ts
	}

	UNSAFE_componentWillReceiveProps(nextProps: IDateTimeIosProps) {
		const { epoch } = nextProps;
		this.setState({
			date: this.getDefaultDate(epoch)
		});
	}

	renderDateTimePickerIos() {
		const { field, updateFieldValue, dateOnly } = this.props;
		const { date } = this.state;
		return (
			<View>
				<DateTimePicker
					value={date}
					mode={'date'}
					display="spinner"
					onChange={(_event, dateObj) => {
						if (dateObj) {
							const unixEpoch = Math.floor(dateObj.getTime() / 1000);
							updateFieldValue(field, unixEpoch);
						}
					}}
				/>
				{!dateOnly && (
					<DateTimePicker
						value={date}
						mode={'time'}
						display="spinner"
						onChange={(_event, dateObj) => {
							if (dateObj) {
								const unixEpoch = Math.floor(dateObj.getTime() / 1000);
								updateFieldValue(field, unixEpoch);
							}
						}}
					/>
				)}
			</View>
		);
	}

	renderDateTimePickerAndroid() {
		const { field, updateFieldValue, dateOnly } = this.props;
		const { date, showAndroidDatePicker, showAndroidTimePicker } = this.state;
		return (
			<View>
				{showAndroidDatePicker && (
					<DateTimePicker
						value={date}
						mode={'date'}
						display="spinner"
						onChange={(_event, dateObj) => {
							this.setState({ showAndroidDatePicker: false });
							if (dateObj) {
								const unixEpoch = Math.floor(dateObj.getTime() / 1000);
								updateFieldValue(field, unixEpoch);
							}
							this.setState({ showAndroidTimePicker: !dateOnly });
						}}
					/>
				)}
				{showAndroidTimePicker && (
					<DateTimePicker
						value={date}
						mode={'time'}
						display="spinner"
						onChange={(_event, dateObj) => {
							this.setState({ showAndroidTimePicker: false });
							if (dateObj) {
								const unixEpoch = Math.floor(dateObj.getTime() / 1000);
								updateFieldValue(field, unixEpoch);
							}
						}}
					/>
				)}
			</View>
		);
	}

	toggleModal() {
		const { showModal } = this.state;
		this.setState({
			showModal: !showModal
		});
	}

	openModal() {
		if (IS_IOS) {
			return this.setState({
				showModal: true
			});
		}

		// on android
		this.setState({
			showAndroidDatePicker: true
		});
	}

	formatDateTime() {
		const { dateOnly, epoch } = this.props;
		if (dateOnly) return formatDate(parseInt(epoch as any));
		return formatDateTime(parseInt(epoch as any));
	}

	render() {
		const { epoch, dateOnly } = this.props;
		const { showModal } = this.state;
		return (
			<View>
				<TouchableBtn onPress={this.openModal}>
					<View style={styles.labelContainer}>
						{!epoch && <Text style={styles.label}>&nbsp;</Text>}
						{!!epoch && <Text style={styles.label}>{this.formatDateTime()}</Text>}
					</View>
				</TouchableBtn>
				{IS_ANDROID && this.renderDateTimePickerAndroid()}
				{IS_IOS && (
					<Modal visible={showModal} onRequestClose={this.toggleModal}>
						<SafeAreaView>
							<View style={styles.titleRow}>
								<TouchableBtn onPress={this.toggleModal}>
									<Ionicons name="md-close" size={26} color={Colors.offWhite} />
								</TouchableBtn>
								<View style={{ flex: 1 }} />
								<View>
									<Text
										style={{
											fontSize: 16
										}}
									>
										Choose {!dateOnly ? 'Date and Time' : 'Date'}
									</Text>
								</View>
								<View style={{ flex: 1 }} />
							</View>
							<View />
							{this.renderDateTimePickerIos()}
						</SafeAreaView>
					</Modal>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	titleRow: {
		flexDirection: 'row-reverse',
		padding: 16,
		alignItems: 'center'
	},
	labelContainer: {
		borderColor: Colors.borderColor,
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
