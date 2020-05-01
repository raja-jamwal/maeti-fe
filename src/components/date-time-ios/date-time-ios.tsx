import * as React from 'react';
import { View, Text, StyleSheet, Modal, DatePickerIOS, SafeAreaView } from 'react-native';
import { formatDate, formatDateTime } from '../../utils';
import Colors from 'src/constants/Colors';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { Ionicons } from '@expo/vector-icons';

interface IDateTimeIosProps {
	epoch: number;
	dateOnly: boolean;
	field: string;
	updateFieldValue: (field: string, unix: number) => any;
}

interface IDateTimeIosState {
	showModal: boolean;
	showTimePicker: boolean;
	date: Date;
}

export default class DateTimeIos extends React.PureComponent<IDateTimeIosProps, IDateTimeIosState> {
	constructor(props: IDateTimeIosProps) {
		super(props);
		this.state = {
			showModal: false,
			showTimePicker: false,
			date: this.getDefaultDate(this.props.epoch || 0)
		};
		this.toggleModal = this.toggleModal.bind(this);
		this.toggleTimePicker = this.toggleTimePicker.bind(this);
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

	renderDateTimePicker() {
		const { field, epoch, updateFieldValue, dateOnly } = this.props;
		const { showTimePicker, date } = this.state;
		return (
			<DatePickerIOS
				date={date}
				mode={!showTimePicker ? 'date' : 'time'}
				onDateChange={dateObj => {
					const unixEpoch = Math.floor(dateObj.getTime() / 1000);
					updateFieldValue(field, unixEpoch);
				}}
			/>
		);
	}

	toggleTimePicker() {
		const { showTimePicker } = this.state;
		this.setState({
			showTimePicker: !showTimePicker
		});
	}

	toggleModal() {
		const { showModal } = this.state;
		this.setState({
			showModal: !showModal
		});
	}

	formatDateTime() {
		const { dateOnly, epoch } = this.props;
		if (dateOnly) return formatDate(parseInt(epoch as any));
		return formatDateTime(parseInt(epoch as any));
	}

	render() {
		const { epoch, dateOnly } = this.props;
		const { showModal, showTimePicker } = this.state;
		return (
			<View>
				<TouchableBtn onPress={this.toggleModal}>
					<View style={styles.labelContainer}>
						{!epoch && <Text style={styles.label}>&nbsp;</Text>}
						{!!epoch && <Text style={styles.label}>{this.formatDateTime()}</Text>}
					</View>
				</TouchableBtn>
				<Modal visible={showModal} onRequestClose={this.toggleModal}>
					<SafeAreaView>
						<View style={styles.titleRow}>
							<TouchableBtn onPress={this.toggleModal}>
								<Ionicons name="md-close" size={26} color={Colors.offWhite} />
							</TouchableBtn>
							<View style={{ flex: 1 }} />
							{!dateOnly && (
								<TouchableBtn onPress={this.toggleTimePicker}>
									<View>
										<Text
											style={{
												fontSize: 16
											}}
										>
											Choose {!showTimePicker ? 'Time' : 'Date'}
										</Text>
									</View>
								</TouchableBtn>
							)}
							<View style={{ flex: 1 }} />
						</View>
						<View />
						{this.renderDateTimePicker()}
					</SafeAreaView>
				</Modal>
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
