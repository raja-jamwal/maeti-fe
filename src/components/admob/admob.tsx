import * as React from 'react';
import { View } from 'react-native';
import { getLogger } from '../../utils/logger';
import { AdMobBanner } from 'expo-ads-admob';
import { getConfig } from '../../config/config';
import { Value } from '../text';
import GlobalStyle from 'src/styles/global';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { simplePrompt } from '../alert/index';
import ConnectedPaymentModal from '../payment-modal/payment-modal';
import { IS_ANDROID } from '../../utils';
import { isAccountPaid, getPayment } from '../../store/reducers/account-reducer';
import { Payment } from '../../store/reducers/account-defination';
import { connect } from 'react-redux';
import { IRootState } from '../../store/index';

export function BaseAdMob(
	{ size, payment, isAccountPaid }: { size: any; payment?: Payment; isAccountPaid: boolean } = {
		size: 'fullBanner',
		isAccountPaid: false
	}
) {
	const logger = getLogger(BaseAdMob);
	// for now just limit to android, we'll roll out to ios later
	if (!IS_ANDROID) return null;
	if (!payment) return null;

	const contactBalance = payment.contactBalance || 0;
	const shouldShowAd = !isAccountPaid || contactBalance === 0;
	if (!shouldShowAd) return null;

	const [isFilled, setIsFilled] = React.useState(true);
	const [showPayment, setShowPayment] = React.useState(false);
	const { admob } = getConfig();
	const { banner_id: bannerId } = admob;
	logger.log(bannerId);

	if (!isFilled) return null;

	return (
		<View>
			<View style={[GlobalStyle.row, { padding: 8 }]}>
				<Value>Sponsored</Value>
				<View style={GlobalStyle.expand} />
				<TouchableBtn
					onPress={() => {
						simplePrompt(
							"Premium member don't see ads",
							'Don’t wait. Initiate. All profiles on our platform are hand picked & verified. With a premium profile, you get contact number of profile and see who viewed your profile, who liked your profile and many more features. Become a Premium Member now and directly reach out to profiles you like.',
							() => setShowPayment(true),
							'Become a Premium Member'
						);
					}}
				>
					<Value>Why I am seeing this?</Value>
				</TouchableBtn>
			</View>
			<AdMobBanner
				bannerSize={size}
				adUnitID={bannerId}
				servePersonalizedAds
				onDidFailToReceiveAdWithError={er => {
					if (er === 'ERROR_CODE_NO_FILL') {
						setIsFilled(false);
					}
				}}
			/>
			<ConnectedPaymentModal show={showPayment} requestClose={() => setShowPayment(false)} />
		</View>
	);
}

const ConnectedAdMob = connect(
	(state: IRootState) => {
		return {
			payment: getPayment(state),
			isAccountPaid: isAccountPaid(state)
		};
	},
	null
)(BaseAdMob);

export default ConnectedAdMob;
