import * as React from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	Image,
	StatusBar,
	SafeAreaView,
	Linking
} from 'react-native';
import { WebView } from 'react-native-webview';
import { getRazor } from '../../utils/payment-wrapper';
import { connect } from 'react-redux';
import { getAccount, fetchAccountByToken } from '../../store/reducers/account-reducer';
import { Account, Order } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { getLogger } from '../../utils/logger';
import Colors from 'src/constants/Colors';
import Button from '../button/button';
import { ApiRequest } from '../../utils';
import { API } from '../../config/API';
import { bindActionCreators, Dispatch } from 'redux';
import { Ionicons } from '@expo/vector-icons';
import TouchableBtn from '../touchable-btn/touchable-btn';
import GlobalStyle from 'src/styles/global';
import { noop } from 'lodash';
import { getConfig } from '../../config/config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { simpleAlert } from '../alert/index';
import { readToken } from '../../utils/index';
import { Throbber } from '../throbber/throbber';

const icon = require('src/assets/images/icon.png');

interface IPaymentModalPassedProps {
	show: boolean;
	requestClose: () => any;
}

interface IPaymentModalMapStateToProps {
	account?: Account;
}

interface IPaymentModalState {
	showRazor: boolean;
	pgOrderId?: string | null;
	showError: boolean;
	monthlySelected: boolean;
	yearlySelected: boolean;
}

interface IPaymentModalMapDispatch {
	fetchAccountByToken: (token: string, skipPushingToken: boolean) => any;
}

type IPaymentModalProps = IPaymentModalMapStateToProps &
	IPaymentModalMapDispatch &
	IPaymentModalPassedProps;

function PlanOption(
	{ numberOfContacts, duration, fullValue, value, onSelect, isSelected, isPopular }: any = {
		onSelect: noop,
		isSelected: false,
		isPopular: false
	}
) {
	return (
		<View style={{ marginBottom: 8 }}>
			<TouchableBtn onPress={onSelect} style={styles.planContainer}>
				<View style={[GlobalStyle.row, GlobalStyle.alignCenter]}>
					<Ionicons
						name={isSelected ? 'ios-radio-button-on' : 'ios-radio-button-off'}
						style={{ padding: 16 }}
						size={20}
						color={isSelected ? Colors.primaryDarkColor : Colors.offWhite}
					/>
					<View style={GlobalStyle.expand}>
						<View style={GlobalStyle.row}>
							<Text style={{ fontSize: 16, fontWeight: 'bold' }}>{duration} for</Text>
							<Text
								style={{
									fontSize: 16,
									fontWeight: 'bold',
									paddingLeft: 8,
									textDecorationLine: 'line-through'
								}}
							>
								₹{fullValue}
							</Text>
							{!!isPopular && (
								<View
									style={{
										backgroundColor: Colors.primaryDarkColor,
										borderRadius: 4,
										marginLeft: 4
									}}
								>
									<Text style={{ color: 'white', fontSize: 8, padding: 4 }}>
										POPULAR
									</Text>
								</View>
							)}
						</View>
						<View>
							<Text style={GlobalStyle.bold}>
								Get {numberOfContacts || 0} Contacts of your choice
							</Text>
							<Text style={{ color: Colors.offWhite }}>Unlimited Messaging</Text>
							<Text style={{ color: Colors.offWhite }}>
								Send and Receive Unlimited Interests and many more features
							</Text>
						</View>
					</View>
					<View style={[GlobalStyle.column, GlobalStyle.alignCenter]}>
						<Text style={{ fontSize: 16, fontWeight: 'bold' }}>₹{value}</Text>
						<View style={{ backgroundColor: 'green', borderRadius: 4 }}>
							<Text style={{ color: 'white', fontSize: 12, padding: 4 }}>
								80% Discount
							</Text>
						</View>
					</View>
				</View>
			</TouchableBtn>
		</View>
	);
}

enum PLANS {
	BIYEARLY,
	YEARLY
}

class PaymentModal extends React.PureComponent<IPaymentModalProps, IPaymentModalState> {
	logger = getLogger(PaymentModal);

	state = {
		showRazor: false,
		showError: false,
		pgOrderId: null,
		monthlySelected: false,
		yearlySelected: true
	};

	// navigation lock to prevent, race condition
	orderProcessing = false;

	requestClose() {
		const { requestClose } = this.props;
		requestClose();
	}

	async startPayment() {
		const { account } = this.props;
		if (!account) return;
		const { monthlySelected } = this.state;
		const biYearlyValue = getConfig().biyearly_plan_value || 0;
		const yearlyValue = getConfig().yearly_plan_value || 0;
		const orderAmount = monthlySelected ? biYearlyValue : yearlyValue;
		try {
			const order = (await ApiRequest(API.ORDER.CREATE, {
				accountId: account.id,
				orderAmount
			})) as Order;
			this.setState({
				pgOrderId: order.pgOrderId,
				showRazor: true
			});
		} catch (err) {
			this.logger.log(`Error creating order ${JSON.stringify(err)}`);
		}
	}

	features = [
		'Send and receive interests',
		'Send messages to your matches',
		'Shortlist profiles',
		'Powerful filters ',
		'See who viewed your profile',
		'See who viewed your contacts',
		'See who shortlisted you',
		'Find profiles in your location',
		'Find profiles in your community',
		'Get recommendations based on preferences',
		'Mutual match'
	];

	async handleNavigationChange(e: any) {
		if (!!e.loading) return;
		const { fetchAccountByToken, account } = this.props;
		const { pgOrderId } = this.state;

		this.logger.log(e.url);

		if (!e.url || !pgOrderId || !account) return;

		if (
			!e.url.startsWith('data:text/html') &&
			e.url.includes('order.done') &&
			!this.orderProcessing
		) {
			this.logger.log('try to mark as paid');
			this.orderProcessing = true;
			try {
				const token = await readToken();
				if (!token) return;
				const updatedAccount = (await fetchAccountByToken(token, true)) as Account;
				const planPackage = updatedAccount.payment.selectedPackage;
				if (planPackage != 'paid') {
					return simpleAlert('Error', 'Unable to process your payment', () => {
						this.orderProcessing = false;
						this.requestClose();
					});
				}
			} catch (er) {
				return simpleAlert(
					'Error - catch',
					'Unable to process your payment, contact support',
					() => {
						this.orderProcessing = false;
						this.requestClose();
					}
				);
			}

			return simpleAlert(
				'Thank you',
				'Thank you for the payment, account is now paid',
				() => {
					this.orderProcessing = false;
					this.requestClose();
				}
			);
		}

		if (!e.url.startsWith('data:text/html') && e.url.includes('order.error')) {
			this.logger.log('try to close modal');
			this.setState({
				showRazor: false,
				showError: true
			});
		}
	}

	openPhoneNumber = () => {
		const whatsAppUrl = getConfig().whatsapp_url || '';
		Linking.openURL(whatsAppUrl);
	};

	onPlanSelect = (plan: PLANS) => {
		return () => {
			const state = {
				monthlySelected: false,
				yearlySelected: false
			};
			if (plan === PLANS.BIYEARLY) {
				state.monthlySelected = true;
				state.yearlySelected = false;
			} else {
				state.monthlySelected = false;
				state.yearlySelected = true;
			}
			this.setState({ ...(state as any) });
		};
	};

	render() {
		const { showRazor, pgOrderId, monthlySelected, yearlySelected, showError } = this.state;
		const { account, show } = this.props;
		if (!account) {
			this.logger.log('account not passed');
			return null;
		}
		const supportNumber = getConfig().support_number || '';
		const statusBarColor = !showRazor ? Colors.white : Colors.primaryDarkColor;
		return (
			<View>
				<Modal
					transparent={true}
					visible={show}
					onRequestClose={() => {
						this.requestClose();
					}}
				>
					<SafeAreaView style={{ flex: 1, backgroundColor: statusBarColor }}>
						<StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
						<View style={{ flexDirection: 'row-reverse' }}>
							{!showRazor && (
								<View
									style={{
										flexDirection: 'row-reverse',

										flex: 1
									}}
								>
									<View>
										<TouchableBtn onPress={() => this.requestClose()}>
											<Ionicons
												name="md-close"
												style={{ padding: 16 }}
												size={32}
												color={Colors.offWhite}
											/>
										</TouchableBtn>
									</View>
									<View
										style={{
											flex: 1,
											justifyContent: 'center'
										}}
									>
										<Image
											source={icon}
											resizeMode="cover"
											style={{
												height: 100,
												marginTop: 16,
												marginRight: -30,
												alignSelf: 'center'
											}}
										/>
									</View>
								</View>
							)}
						</View>
						{!showRazor && (
							<View
								style={[
									{
										flex: 1,
										flexDirection: 'column-reverse'
									},
									GlobalStyle.padding
								]}
							>
								<View>
									<Button
										labelStyle={{
											fontSize: 18,
											fontWeight: 'bold'
										}}
										isPrimary={true}
										label="Make Payment"
										onPress={() => this.startPayment()}
									/>
								</View>
								<View style={GlobalStyle.expand} />
								<View style={[GlobalStyle.row, GlobalStyle.justifyCenter]}>
									<TouchableOpacity onPress={this.openPhoneNumber}>
										<Text
											style={[styles.underline, { color: Colors.offWhite }]}
										>
											{supportNumber}
										</Text>
									</TouchableOpacity>
								</View>
								<Text
									style={[
										GlobalStyle.bold,
										{
											textAlign: 'center',
											fontSize: 16,
											color: Colors.offWhite
										}
									]}
								>
									For any question or help call or whatsapp us at
								</Text>
								<PlanOption
									numberOfContacts={35}
									duration="6 Months"
									fullValue="4,500"
									value="849"
									isSelected={monthlySelected}
									onSelect={() => this.onPlanSelect(PLANS.BIYEARLY)()}
								/>
								<PlanOption
									numberOfContacts={70}
									duration="1 Year"
									fullValue="6,500"
									value="1399"
									isPopular={true}
									isSelected={yearlySelected}
									onSelect={() => this.onPlanSelect(PLANS.YEARLY)()}
								/>
								<Text
									style={[
										GlobalStyle.bold,
										{ fontSize: 16 },
										GlobalStyle.padding
									]}
								>
									Limited Time Offer
								</Text>
								{showError && (
									<View style={{ backgroundColor: Colors.errorBackground }}>
										<Text
											style={[
												{ textAlign: 'center', color: Colors.errorText },
												GlobalStyle.padding
											]}
										>
											Unable to process your payment, You can try again or
											Contact support for help.
										</Text>
									</View>
								)}
							</View>
						)}
						{!!showRazor && pgOrderId && (
							<WebView
								source={{
									html: getRazor(
										pgOrderId,
										account.userProfile.fullName,
										account.phoneNumber
									)
								}}
								onMessage={e => console.log(e)}
								javaScriptEnabled={true}
								style={{ flex: 1 }}
								startInLoadingState={true}
								renderLoading={() => <Throbber size="large" />}
								onNavigationStateChange={e => this.handleNavigationChange(e)}
							/>
						)}
					</SafeAreaView>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	advt: {
		backgroundColor: 'white',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1,
		borderRadius: 20,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0
	},
	planContainer: {
		borderColor: Colors.borderColor,
		borderStyle: 'solid',
		borderWidth: 1,
		padding: 12,
		borderRadius: 8
	},
	underline: {
		textDecorationLine: 'underline'
	}
});

const mapStateToProps = (state: IRootState) => {
	return {
		account: getAccount(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchAccountByToken: bindActionCreators(fetchAccountByToken, dispatch)
		// fetchAccount: bindActionCreators(fetchAccount, dispatch)
	};
};

const ConnectedPaymentModal = connect(
	mapStateToProps,
	mapDispatchToProps
)(PaymentModal);

export default ConnectedPaymentModal;
