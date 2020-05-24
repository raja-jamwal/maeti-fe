import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ConnectedPaymentModal from '../components/payment-modal/payment-modal';
import { getAccount, getCurrentUserProfileId } from '../store/reducers/account-reducer';
import { getUserProfileForId } from '../store/reducers/user-profile-reducer';
import { connect } from 'react-redux';
import moment from 'moment';
import { Value } from '../components/text';
import { logoutAccount, getCeStatus, setCeStatus } from '../utils';
import { getEnvironment } from '../utils/environment';
import { getConfig } from '../config/config';
import ConnectedVerificationModal from 'src/components/verification-modal/verification-modal';
import {
	SettingTitle,
	SettingDivider,
	SettingRow,
	SettingBlock,
	SettingPara
} from '../components/settings/settings';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Prompt from 'react-native-input-prompt';
import { ApiRequest } from '../utils';
import { API } from '../config/API';
import { isEmpty } from 'lodash';

class MoreScreen extends React.Component {
	static navigationOptions = {
		title: 'Settings'
	};

	copyrightClickCount = 0;

	state = {
		showPayment: false,
		showCePrompt: false,
		isCeMode: false
	};

	toggleStartPayment() {
		this.setState(prevState => ({
			showPayment: !prevState.showPayment
		}));
	}

	// given a ts (unix epoch in seconds)
	getDate(epoch) {
		return new Date(epoch * 1000);
	}

	async doLogout() {
		await logoutAccount();
	}

	onCopyrightClickCount() {
		if (this.copyrightClickCount >= 10) {
			this.setState({
				showCePrompt: true
			});
		} else {
			this.copyrightClickCount++;
		}
	}

	async componentDidMount() {
		try {
			const isCeMode = await getCeStatus();
			this.setState({
				isCeMode
			});
		} catch (er) {}
	}

	async getCeAccessFromStatus(password) {
		this.copyrightClickCount = 0;
		if (isEmpty(password)) {
			return;
		}
		try {
			// if the request goes through
			// we've a valid CE
			await ApiRequest(API.CE.GET, {
				password
			});
			await setCeStatus();
			this.setState({
				showCePrompt: false,
				isCeMode: true
			});
		} catch (er) {
			this.setState({
				showCePrompt: false
			});
		}
	}

	render() {
		const { showPayment, showCePrompt, isCeMode } = this.state;
		const { currentUserProfile, account, navigation } = this.props;
		const payment = account.payment;
		const isPaid = payment.selectedPackage === 'paid';
		const otaVersion = getConfig().ota_version || 0;
		return (
			<ScrollView style={styles.container}>
				<SettingTitle label={'Payments'} />
				<SettingBlock>
					<SettingRow label="Plan" value={isPaid ? 'Paid' : 'Free'} />
					{!isPaid && (
						<SettingPara>
							You are currently on promotional free account, you will get unlimited
							full account access for 3 months after verification. You can verify your
							account for free.
						</SettingPara>
					)}
				</SettingBlock>

				{isPaid && (
					<SettingBlock>
						<SettingDivider />
						<SettingRow
							label="Expires on"
							value={moment(this.getDate(payment.expiryDate || 0)).format(
								'dddd, MMMM Do YYYY'
							)}
						/>
						<SettingDivider />
						<SettingRow label="Receipt Number" value={payment.receiptNumber} />
					</SettingBlock>
				)}

				<SettingTitle label={'Account'} />
				<SettingBlock>
					<SettingRow
						label="Blocked Accounts"
						action={() => navigation.push('BlockedProfileListScreen')}
					/>
					<SettingDivider />
					<SettingRow label="Registered As" value={currentUserProfile.fullName} />
					<SettingDivider />
					{!isPaid && (
						<SettingRow
							label="Verify Account"
							action={() => this.toggleStartPayment()}
						/>
					)}
					{!isPaid && <SettingDivider />}
					<SettingRow label="Logout Account" action={() => this.doLogout()} />
				</SettingBlock>

				<SettingTitle label={'Maeti'} />
				<SettingBlock>
					<SettingRow label="Environment" value={getEnvironment()} />
					<SettingDivider />
					<SettingRow label="OTA Version" value={otaVersion} />
					<SettingDivider />
					<SettingRow label="Support" value="support@datagrids.in" />
					<SettingDivider />
					<SettingRow label="Phone Support" value="+91-73877-78673" />
					{isCeMode && <SettingRow label="CE mode" value="activated" />}
				</SettingBlock>

				<ConnectedVerificationModal
					show={showPayment}
					requestClose={() => this.toggleStartPayment()}
				/>

				<TouchableOpacity
					style={{ padding: 32 }}
					onPress={() => this.onCopyrightClickCount()}
				>
					<Value style={{ textAlign: 'center' }}>
						© {new Date().getFullYear()} DataGrid Softwares LLP. Use of this software is
						under Terms and conditions
					</Value>
				</TouchableOpacity>

				<Prompt
					visible={showCePrompt}
					title="Your ID"
					placeholder="Your ID"
					onCancel={() =>
						this.setState({
							showCePrompt: false
						})
					}
					onSubmit={async text => await this.getCeAccessFromStatus(text)}
				/>

				{false && (
					<ConnectedPaymentModal
						show={showPayment}
						requestClose={() => this.toggleStartPayment()}
					/>
				)}
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgb(229, 235, 240)'
	},
	title: {
		fontSize: 20
	}
});

const mapStateToProps = state => {
	const currentUserProfileId = getCurrentUserProfileId(state);
	return {
		account: getAccount(state),
		currentUserProfile: getUserProfileForId(state, currentUserProfileId)
	};
};

export default connect(
	mapStateToProps,
	null
)(MoreScreen);
