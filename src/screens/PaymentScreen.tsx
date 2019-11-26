import * as React from 'react';
import { View, Text, Modal, WebView } from 'react-native';
import { getRazor } from '../utils/payment-wrapper';
import { Account } from '../store/reducers/account-defination';
import { connect } from 'react-redux';
import { IRootState } from '../store';
import { getAccount } from '../store/reducers/account-reducer';

interface IPaymentScreenMapStateToProps {
	account: Account;
}

interface IPaymentScreenState {
	showing: boolean;
}

type IPaymentScreenProps = IPaymentScreenMapStateToProps;

class PaymentScreen extends React.PureComponent<IPaymentScreenProps, IPaymentScreenState> {
	state = {
		showing: true
	};

	toggleShowModal() {
		this.setState(prevState => ({ showing: !prevState.showing }));
	}

	render() {
		const { showing } = this.state;
		const { account } = this.props;
		if (!account) return null;
		return (
			<View>
				<Modal
					animationType="slide"
					transparent={false}
					visible={showing}
					onRequestClose={() => {
						this.toggleShowModal();
					}}
				>
					<View style={{ marginTop: 200, backgroundColor: 'black' }}>
						<Text>Hello</Text>
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
							style={{ flex: 1, width: 500, height: 500 }}
						/>
					</View>
				</Modal>
			</View>
		);
	}
}

const mapStateToProps = (state: IRootState) => {
	return {
		account: getAccount(state)
	};
};

const ConnectedPayment = connect(
	mapStateToProps,
	null
)(PaymentScreen);
export default ConnectedPayment;
