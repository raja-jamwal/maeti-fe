import * as React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Text from '../text';
import { connect } from 'react-redux';
import { IRootState } from '../../store/index';
import { Payment } from '../../store/reducers/account-defination';
import GlobalStyle from 'src/styles/global';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Colors from 'src/constants/Colors';
import { isAccountPaid } from '../../store/reducers/account-reducer';
import Button from '../button/button';
import ConnectedPaymentModal from '../payment-modal/payment-modal';
const moment = require('moment');

interface IAccountSummaryProps {
	payment?: Payment;
	isAccountPaid: boolean;
}

const AccountSummary = ({ payment, isAccountPaid }: IAccountSummaryProps) => {
	if (!payment) return null;
	const [showPaymentModal, setShowPaymentModal] = React.useState(false);
	const expiryTs = (payment.expiryDate || 0) * 1000;
	const registrationTs = payment.registrationDate * 1000;
	const currentTs = new Date().getTime();
	const expiryDate = new Date(expiryTs || registrationTs);
	const formattedDate = moment(expiryDate).format('d MMM YY');
	const CIRCLE_SIZE = 70;
	const ARC_WIDTH = 3;
	const expiryPct = ((expiryTs - currentTs) / (expiryTs - registrationTs)) * 100;
	const contactBalance = isAccountPaid ? payment.contactBalance || 0 : 0;
	const shouldShowPurchaseBtn = !isAccountPaid || contactBalance === 0;
	return (
		<View style={[styles.container]}>
			<View style={GlobalStyle.row}>
				<Text
					style={[
						styles.label,
						{
							padding: 0,
							paddingRight: 4,
							paddingBottom: 12,
							fontSize: 14,
							textTransform: 'none'
						}
					]}
				>
					Account:
				</Text>
				<Text
					style={[
						styles.label,
						{ padding: 0, paddingBottom: 12, fontSize: 14, textTransform: 'none' }
					]}
				>
					{payment.selectedPackage === 'free' ? 'Free' : 'Paid'}
				</Text>
			</View>
			<View style={[GlobalStyle.row, GlobalStyle.alignCenter, GlobalStyle.justifyCenter]}>
				<View
					style={[
						GlobalStyle.expand,
						GlobalStyle.column,
						GlobalStyle.alignCenter,
						GlobalStyle.justifyCenter
					]}
				>
					<AnimatedCircularProgress
						size={CIRCLE_SIZE}
						width={ARC_WIDTH}
						fill={contactBalance}
						duration={2 * 1000}
						tintColor={Colors.primaryDarkColor}
						backgroundColor={Colors.borderColor}
					>
						{fill => <Text style={styles.metric}>{contactBalance}</Text>}
					</AnimatedCircularProgress>
					<Text style={styles.label}>Contact Balance Left</Text>
				</View>
				{isAccountPaid && (
					<View
						style={[
							GlobalStyle.expand,
							GlobalStyle.column,
							GlobalStyle.alignCenter,
							GlobalStyle.justifyCenter
						]}
					>
						<AnimatedCircularProgress
							size={CIRCLE_SIZE}
							width={ARC_WIDTH}
							fill={expiryPct}
							duration={2 * 1000}
							tintColor={Colors.primaryDarkColor}
							backgroundColor={Colors.borderColor}
						>
							{fill => <Text style={styles.metric}>{formattedDate}</Text>}
						</AnimatedCircularProgress>
						<Text style={styles.label}>Valid Upto</Text>
					</View>
				)}
				<View
					style={[
						GlobalStyle.expand,
						GlobalStyle.column,
						GlobalStyle.alignCenter,
						GlobalStyle.justifyCenter
					]}
				>
					<AnimatedCircularProgress
						size={CIRCLE_SIZE}
						width={ARC_WIDTH}
						fill={100}
						duration={2 * 1000}
						tintColor={Colors.primaryDarkColor}
						backgroundColor={Colors.borderColor}
					>
						{fill => <Text style={[styles.metric, { fontSize: 18 }]}>∞</Text>}
					</AnimatedCircularProgress>
					<Text style={styles.label}>Unlimited Messaging</Text>
				</View>
				<View
					style={[
						GlobalStyle.expand,
						GlobalStyle.column,
						GlobalStyle.alignCenter,
						GlobalStyle.justifyCenter
					]}
				>
					<AnimatedCircularProgress
						size={CIRCLE_SIZE}
						width={ARC_WIDTH}
						fill={100}
						duration={2 * 1000}
						tintColor={Colors.primaryDarkColor}
						backgroundColor={Colors.borderColor}
					>
						{fill => <Text style={[styles.metric, { fontSize: 18 }]}>∞</Text>}
					</AnimatedCircularProgress>
					<Text style={styles.label}>Unlimited Interest</Text>
				</View>
			</View>
			{shouldShowPurchaseBtn && (
				<View
					style={[
						GlobalStyle.row,
						GlobalStyle.justifyCenter,
						GlobalStyle.alignCenter,
						{ marginTop: 8 }
					]}
				>
					<Button onPress={() => setShowPaymentModal(true)} label="Purchase Plan" />
				</View>
			)}
			<ConnectedPaymentModal
				show={showPaymentModal}
				requestClose={() => setShowPaymentModal(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 8,
		padding: 12,
		borderRadius: 12,
		...Platform.select({
			ios: {
				shadowOpacity: 0.1,
				shadowRadius: 5,
				shadowOffset: {
					height: 0,
					width: 0
				}
			},
			android: {
				// elevation: 1
			}
		})
	},
	label: {
		padding: 8,
		color: Colors.offWhite,
		textAlign: 'center',
		fontSize: 8,
		textTransform: 'uppercase'
	},
	metric: {
		color: Colors.offWhite,
		textAlign: 'center',
		fontSize: 14,
		padding: 4,
		fontWeight: '500'
	}
});

export default connect((state: IRootState) => ({
	payment: state.account.payment,
	isAccountPaid: isAccountPaid(state)
}))(AccountSummary);
