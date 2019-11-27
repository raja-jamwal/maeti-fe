import * as React from 'react';
import { View, Text, Modal, WebView, StyleSheet, Image, ScrollView, StatusBar } from 'react-native';
import { getRazor } from '../../utils/payment-wrapper';
import { connect } from 'react-redux';
import { getAccount } from '../../store/reducers/account-reducer';
import { Account } from '../../store/reducers/account-defination';
import { IRootState } from '../../store';
import { getLogger } from '../../utils/logger';
import Layout from 'src/constants/Layout';
import Colors from 'src/constants/Colors';
import Button from '../button/button';

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
}

type IPaymentModalProps = IPaymentModalMapStateToProps & IPaymentModalPassedProps;

class PaymentModal extends React.PureComponent<IPaymentModalProps, IPaymentModalState> {
	logger = getLogger(PaymentModal);

	state = {
		showRazor: false
	};

	requestClose() {
		const { requestClose } = this.props;
		requestClose();
	}

	startPayment() {
		console.log('log log');
		this.logger.log('starting payment');
		this.setState({
			showRazor: true
		});
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

	render() {
		const { showRazor } = this.state;
		const { account, show } = this.props;
		if (!account) {
			this.logger.log('account not passed');
			return null;
		}
		this.logger.log('starting payment session');
		return (
			<View>
				<Modal
					// animationType="slide"
					transparent={false}
					visible={show}
					onRequestClose={() => {
						this.requestClose();
					}}
				>
					<StatusBar backgroundColor={Colors.primaryDarkColor} barStyle="light-content" />
					<View style={{ flex: 1 }}>
						{!showRazor && (
							<View style={{ flex: 1 }}>
								<View style={styles.paymentPlansContainer} />
								<View
									style={{
										position: 'absolute',
										width: Layout.window.width
									}}
								>
									<View
										style={{
											flex: 1,
											height: Layout.window.height - 100,
											padding: 16,
											flexDirection: 'column',
											justifyContents: 'center'
										}}
									>
										<View style={styles.advt}>
											<Image
												source={icon}
												resizeMode="contain"
												style={{ height: 100, margin: 16 }}
											/>
											<View style={{ flex: 1 }}>
												<ScrollView showsVerticalScrollIndicator={true}>
													{this.features.map((feature, i) => {
														return (
															<Text
																key={i}
																style={styles.featureLine}
															>
																{feature}
															</Text>
														);
													})}
												</ScrollView>
											</View>
											<Text style={styles.priceOld}>₹1,500/yr</Text>
											<Text style={styles.priceNew}>₹500/yr</Text>
										</View>
										<View>
											<Button
												label="Purchase Plan - ₹500/yr"
												onPress={() => this.startPayment()}
											/>
										</View>
									</View>
								</View>
							</View>
						)}
						{!!showRazor && (
							<WebView
								source={{
									html: getRazor(
										'order_DkuaRWc7vAonZu',
										account.userProfile.fullName,
										account.phoneNumber
									)
								}}
								onMessage={e => console.log(e)}
								javaScriptEnabled={true}
								style={{ flex: 1 }}
							/>
						)}
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	paymentPlansContainer: {
		height: Layout.window.height / 2,
		backgroundColor: Colors.primaryDarkColor,
		flexDirection: 'row',
		justifyContent: 'center',
		zIndex: 0
	},
	advt: {
		backgroundColor: 'white',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		flex: 1
	},
	featureLine: {
		textAlign: 'center',
		color: Colors.offWhite,
		padding: 4
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
	}
});

const mapStateToProps = (state: IRootState) => {
	return {
		account: getAccount(state)
	};
};

const ConnectedPaymentModal = connect(
	mapStateToProps,
	null
)(PaymentModal);

export default ConnectedPaymentModal;
