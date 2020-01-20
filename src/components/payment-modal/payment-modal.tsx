import * as React from 'react';
import {
	View,
	Text,
	Modal,
	WebView,
	StyleSheet,
	Image,
	ScrollView,
	StatusBar,
	SafeAreaView
} from 'react-native';
import { getRazor } from '../../utils/payment-wrapper';
import { connect } from 'react-redux';
import { fetchAccount, getAccount } from '../../store/reducers/account-reducer';
import { Account, Order } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { getLogger } from '../../utils/logger';
import Layout from 'src/constants/Layout';
import Colors from 'src/constants/Colors';
import Button from '../button/button';
import { ApiRequest } from '../../utils';
import { API } from '../../config/API';
import { bindActionCreators, Dispatch } from 'redux';
import { Ionicons } from '@expo/vector-icons';
import TouchableBtn from '../touchable-btn/touchable-btn';

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
}

interface IPaymentModalMapDispatch {
	fetchAccount: (id: string, skipPushingToken: boolean) => any;
}

type IPaymentModalProps = IPaymentModalMapStateToProps &
	IPaymentModalMapDispatch &
	IPaymentModalPassedProps;

class PaymentModal extends React.PureComponent<IPaymentModalProps, IPaymentModalState> {
	logger = getLogger(PaymentModal);

	state = {
		showRazor: false,
		pgOrderId: null
	};

	requestClose() {
		const { requestClose } = this.props;
		requestClose();
	}

	async startPayment() {
		const { account } = this.props;
		if (!account) return;
		try {
			const order = (await ApiRequest(API.ORDER.CREATE, { accountId: account.id })) as Order;
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
		const { fetchAccount, account, requestClose } = this.props;
		const { pgOrderId } = this.state;

		this.logger.log(e.url);

		if (!e.url || !pgOrderId || !account) return;

		if (!e.url.startsWith('data:text/html') && e.url.includes('order.success')) {
			this.logger.log('try to mark as paid');
			await fetchAccount(account.id as any, true);
			setTimeout(() => this.requestClose(), 2 * 1000);
			// requestClose();
		}

		if (!e.url.startsWith('data:text/html') && e.url.includes('order.error')) {
			this.logger.log('try to close modal');
			requestClose();
		}
	}

	render() {
		const { showRazor, pgOrderId } = this.state;
		const { account, show } = this.props;
		if (!account) {
			this.logger.log('account not passed');
			return null;
		}
		this.logger.log('starting payment session');
		const statusBarColor = !showRazor ? Colors.white : Colors.primaryDarkColor;
		return (
			<View>
				<Modal
					// animationType="slide"
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
												size={26}
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
											resizeMode="contain"
											style={{
												height: 100,
												margin: 16,
												marginRight: -30,
												alignSelf: 'center'
											}}
										/>
									</View>
								</View>
							)}
						</View>
						{!showRazor && (
							<View style={{ flex: 1 }}>
								<View
									style={{
										position: 'absolute',
										width: Layout.window.width
									}}
								>
									<View
										style={{
											flex: 1,
											padding: 16,
											flexDirection: 'column',
											justifyContents: 'center'
										}}
									>
										<View>
											<Text style={styles.tagLine}>
												Shindiyun Lae Sindhi Rishta
											</Text>
										</View>
										<View style={{ flex: 1 }}>
											<ScrollView showsVerticalScrollIndicator={true}>
												{this.features.map((feature, i) => {
													return (
														<Text key={i} style={styles.featureLine}>
															{feature}
														</Text>
													);
												})}
											</ScrollView>
										</View>
										<View
											style={{
												flex: 1,
												alignItems: 'center'
											}}
										>
											<Text style={styles.priceNew}>₹500/yr</Text>
											<Text style={styles.priceOld}>₹1,500/yr</Text>
										</View>
									</View>
									<View>
										<Button
											style={{
												borderTopLeftRadius: 5,
												borderTopRightRadius: 5,
												marginLeft: 40,
												marginRight: 50,
												backgroundColor: Colors.primaryDarkColor,
												Color: Colors.white
											}}
											labelStyle={{
												color: 'white'
											}}
											label="Buy for ₹500/yr"
											onPress={() => this.startPayment()}
										/>
									</View>
								</View>
							</View>
						)}
						{!!showRazor && pgOrderId && (
							<WebView
								useWebKit={true}
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
	featureLine: {
		textAlign: 'center',
		color: Colors.offWhite,
		padding: 1
	},
	priceOld: {
		fontSize: 20,
		fontWeight: 'bold',
		textDecorationLine: 'line-through',
		textDecorationStyle: 'solid',
		color: Colors.offWhite
	},
	priceNew: {
		fontSize: 30,
		fontWeight: 'bold'
	},
	tagLine: {
		textAlign: 'center',
		color: Colors.black,
		fontSize: 35,
		fontWeight: 'bold',
		marginLeft: 10,
		position: 'relative',
		top: -40
	}
});

const mapStateToProps = (state: IRootState) => {
	return {
		account: getAccount(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchAccount: bindActionCreators(fetchAccount, dispatch)
	};
};

const ConnectedPaymentModal = connect(
	mapStateToProps,
	mapDispatchToProps
)(PaymentModal);

export default ConnectedPaymentModal;
