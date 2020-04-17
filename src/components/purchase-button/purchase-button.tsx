import * as React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { isAccountPaid } from '../../store/reducers/account-reducer';
import Colors from 'src/constants/Colors';
import ConnectedPaymentModal from '../payment-modal/payment-modal';
import TouchableBtn from '../touchable-btn/touchable-btn';
import ConnectedVerificationModal from 'src/components/verification-modal/verification-modal';

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
			<TouchableBtn style={{ flex: 1 }} onPress={() => this.toggleStartPayment()}>
				<View style={styles.contactActionBtn}>
					<Text style={styles.btnLabel}>{label}</Text>
					{false && (
						<ConnectedPaymentModal
							show={showPayment}
							requestClose={() => this.toggleStartPayment()}
						/>
					)}
					<ConnectedVerificationModal
						show={showPayment}
						requestClose={() => this.toggleStartPayment()}
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
