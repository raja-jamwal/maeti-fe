import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { isAccountPaid, getPayment } from '../../store/reducers/account-reducer';
import Colors from 'src/constants/Colors';
import ConnectedPaymentModal from '../payment-modal/payment-modal';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { AdPurchaseModal, AdPurchaseCloseStatus } from '../ad-purchase-modal/ad-purchase-modal';
import { Payment } from '../../store/reducers/account-defination';
import { IS_ANDROID } from '../../utils';

interface IPurchaseButtonProps {
	children: any;
	label: string;
	isAccountPaid: boolean;
	onAllowBehindAd?: (status: AdPurchaseCloseStatus) => void;
	payment?: Payment;
	contactBalanceAware?: boolean;
}

interface IPurchaseButtonState {
	showPayment: boolean;
	showAdPurchaseModal: boolean;
}

class PurchaseButton extends React.PureComponent<IPurchaseButtonProps, IPurchaseButtonState> {
	state = {
		showPayment: false,
		showAdPurchaseModal: false
	};

	toggleStartPayment() {
		this.setState(prevState => ({
			showPayment: !prevState.showPayment,
			showAdPurchaseModal: false
		}));
	}

	async maybeShowAd() {
		const { onAllowBehindAd } = this.props;
		// limited on android now
		if (onAllowBehindAd) {
			this.setState({
				showAdPurchaseModal: true
			});
		} else {
			this.toggleStartPayment();
		}
	}

	async handleAdPurchaseModalClose(closeStatus: AdPurchaseCloseStatus) {
		const { onAllowBehindAd } = this.props;
		if (!onAllowBehindAd) return;
		this.setState({
			showAdPurchaseModal: false
		});

		if (closeStatus === AdPurchaseCloseStatus.REWARDED) {
			onAllowBehindAd(closeStatus);
		}
	}

	render() {
		const { label, children, isAccountPaid, contactBalanceAware, payment } = this.props;
		const { showPayment, showAdPurchaseModal } = this.state;
		const isContactBalanceZero = payment && payment.contactBalance === 0;
		if (isAccountPaid) {
			if (contactBalanceAware) {
				if (!isContactBalanceZero) {
					return children;
				}
			} else {
				return children;
			}
		}

		return (
			<TouchableBtn style={{ flex: 1 }} onPress={() => this.maybeShowAd()}>
				<View style={styles.contactActionBtn}>
					<Text style={styles.btnLabel}>{label}</Text>
					<Text style={styles.paidLabel}>PAID</Text>
					<ConnectedPaymentModal
						show={showPayment}
						requestClose={() => this.toggleStartPayment()}
					/>
					<AdPurchaseModal
						show={showAdPurchaseModal}
						requestClose={async reason => await this.handleAdPurchaseModalClose(reason)}
						startPayment={() => this.toggleStartPayment()}
					/>
				</View>
			</TouchableBtn>
		);
	}
}

const styles = StyleSheet.create({
	contactActionBtn: {
		backgroundColor: Colors.primaryDarkColor,
		paddingTop: 5,
		paddingBottom: 5,
		margin: 10,
		borderRadius: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		...Platform.select({
			android: {
				flex: 1
			}
		})
	},
	btnLabel: {
		color: 'white',
		padding: 2
	},
	paidLabel: {
		color: 'white',
		padding: 2,
		fontSize: 8,
		fontWeight: 'bold'
	}
});

const mapStateToProps = (state: IRootState) => {
	return {
		isAccountPaid: isAccountPaid(state),
		payment: getPayment(state)
	};
};

const ConnectedPurchaseButton = connect(
	mapStateToProps,
	null
)(PurchaseButton);

export default ConnectedPurchaseButton;
