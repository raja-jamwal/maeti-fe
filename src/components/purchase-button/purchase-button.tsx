import * as React from 'react';
import { View, Text, StyleSheet, TouchableNativeFeedback } from 'react-native';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { isAccountPaid } from '../../store/reducers/account-reducer';
import Colors from 'src/constants/Colors';
import ConnectedPaymentModal from '../payment-modal/payment-modal';

interface IPurchaseButtonProps {
	children: any;
	label: string;
	isAccountPaid: boolean;
}

interface IPurchaseButtonState {
	showPayment: boolean;
}

class PurchaseButton extends React.PureComponent<IPurchaseButtonProps, IPurchaseButtonState> {
	state = {
		showPayment: false
	};

	toggleStartPayment() {
		this.setState(prevState => ({
			showPayment: !prevState.showPayment
		}));
	}

	render() {
		const { label, children, isAccountPaid } = this.props;
		const { showPayment } = this.state;
		if (isAccountPaid) {
			return children;
		}

		return (
			<TouchableNativeFeedback onPress={() => this.toggleStartPayment()}>
				<View style={styles.contactActionBtn}>
					<Text style={styles.btnLabel}>{label}</Text>
					<ConnectedPaymentModal
						show={showPayment}
						requestClose={() => this.toggleStartPayment()}
					/>
				</View>
			</TouchableNativeFeedback>
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
		flex: 1
	},
	btnLabel: {
		color: 'white',
		padding: 2
	}
});

const mapStateToProps = (state: IRootState) => {
	return {
		isAccountPaid: isAccountPaid(state)
	};
};

const ConnectedPurchaseButton = connect(
	mapStateToProps,
	null
)(PurchaseButton);

export default ConnectedPurchaseButton;
