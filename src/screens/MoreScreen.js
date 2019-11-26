import React from 'react';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Text from '../components/text/index';
import Colors from '../constants/Colors';
import ConnectedPaymentModal from '../components/payment-modal/payment-modal';
import Button from '../components/button/button';

class MoreScreen extends React.Component {
	static navigationOptions = {
		title: 'More'
	};

	state = {
		showPayment: false
	};

	toggleStartPayment() {
		this.setState(prevState => ({
			showPayment: !prevState.showPayment
		}));
	}

	render() {
		const { showPayment } = this.state;
		return (
			<View style={styles.container}>
				<Text style={[styles.title]}>Rishto v0.1</Text>
				<Text style={styles.offWhite}>Sindhyun jo Sindhyun sa</Text>
				<Text style={styles.offWhite}>For support & help contact</Text>
				<Text style={styles.offWhite}>feedback@domain.com</Text>

				<Button label="Start Payment Modal" onPress={() => this.toggleStartPayment()} />

				<ConnectedPaymentModal
					show={showPayment}
					requestClose={() => this.toggleStartPayment()}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
		// backgroundColor: 'pink'
	},
	title: {
		fontSize: 20
	},
	offWhite: {
		color: Colors.offWhite
	}
});

export default MoreScreen;
