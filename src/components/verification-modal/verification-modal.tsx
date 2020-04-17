import * as React from 'react';
import { View, Text, StyleSheet, Modal, SafeAreaView, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import Colors from 'src/constants/Colors';
import TouchableBtn from 'src/components/touchable-btn/touchable-btn';

import { Ionicons } from '@expo/vector-icons';
import { noop } from 'lodash';
import { SlackPostMessage } from 'src/utils/slack';
import { Throbber } from '../throbber/throbber';
import { getLogger } from '../../utils/logger';
import { getAccount } from 'src/store/reducers/account-reducer';

function VerificationModal(
	{ account, show, requestClose } = {
		account: { id: null },
		show: false,
		requestClose: noop
	}
) {
	const logger = getLogger(VerificationModal);
	const [isLoading, setIsLoading] = React.useState(false);
	const [isRequested, setIsRequested] = React.useState(false);
	const sendSlackRequest = async () => {
		setIsLoading(true);
		setIsRequested(false);
		try {
			if (!account.id) {
				throw new Error('no account passed');
			}
			await SlackPostMessage(
				`${account.id} is requesting verification callback, React with :eyes:`
			);
			setIsRequested(true);
		} catch (err) {
			logger.log(err);
			setIsRequested(false);
		} finally {
			setIsLoading(false);
		}
	};
	const isRequestReceived = !isLoading && isRequested;
	return (
		<View>
			<Modal transparent={true} visible={show} onRequestClose={requestClose}>
				<SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
					<StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
					<View style={{ flexDirection: 'row-reverse' }}>
						<TouchableBtn onPress={requestClose}>
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
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<View
							style={{
								flexDirection: 'column',
								alignItems: 'center',
								marginBottom: 12,
								marginTop: -12
							}}
						>
							<Text style={[styles.label, { fontSize: 50 }]}>✅</Text>
							<Text style={styles.label}>Get verified for FREE</Text>
							<Text style={styles.label}>Get full account access for 4 months</Text>
							<Text style={styles.label}>We'll call you on your number</Text>
							<Text style={styles.label}>Please keep proof-of-identity handy</Text>
						</View>

						{!isLoading && !isRequested && (
							<TouchableBtn
								style={{
									backgroundColor: Colors.primaryDarkColor,
									padding: 16,
									borderRadius: 8
								}}
								onPress={sendSlackRequest}
							>
								<Text style={{ color: Colors.white }}>
									Request Verification Callback
								</Text>
							</TouchableBtn>
						)}
						{isLoading && <Throbber size={'small'} />}
						{isRequestReceived && (
							<Text style={styles.label}>Your request have been received</Text>
						)}
						{isRequestReceived && (
							<Text style={styles.label}> We'll soon call you back</Text>
						)}
					</View>
				</SafeAreaView>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	label: {
		color: '#222',
		fontSize: 16,
		padding: 4
	}
});

export default connect(
	(state: IRootState) => {
		return {
			account: getAccount(state)
		};
	},
	null
)(VerificationModal);
