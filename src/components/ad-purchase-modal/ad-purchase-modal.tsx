import * as React from 'react';
import { View, Text, Modal, SafeAreaView, StatusBar, Linking } from 'react-native';
import Colors from 'src/constants/Colors';
import TouchableBtn from 'src/components/touchable-btn/touchable-btn';

import { Ionicons } from '@expo/vector-icons';
import { noop } from 'lodash';
//import { SlackPostMessage } from 'src/utils/slack';
import { Throbber } from '../throbber/throbber';
import Button from '../button/button';
import { getLogger } from '../../utils/logger';
import GlobalStyle from 'src/styles/global';
import { Value } from '../text';
import { getConfig } from '../../config/config';
import { AdMobRewarded } from 'expo-ads-admob';

export enum AdPurchaseCloseStatus {
	CLOSE,
	REWARDED
}

export function AdPurchaseModal(
	{ show, requestClose, startPayment } = {
		show: false,
		requestClose: noop,
		startPayment: noop
	}
) {
	const logger = getLogger(AdPurchaseModal);
	const { whatsapp_link, support_number, admob } = getConfig();
	const { reward_id: rewardAdId } = admob;

	if (!rewardAdId) {
		logger.log('There is no reward id');
	}
	const [isLoading, setIsLoading] = React.useState(false);
	const [isRewarded, setIsRewarded] = React.useState(false);
	const [isAdError, setIsAdError] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			// Display a rewarded ad
			await AdMobRewarded.setAdUnitID(rewardAdId);
		})();
	}, []);

	AdMobRewarded.addEventListener('rewardedVideoDidRewardUser', _so => {
		logger.log('reward the user here');
		setIsRewarded(true);
	});

	AdMobRewarded.addEventListener('rewardedVideoDidFailToLoad', () => {
		logger.log('reward video fail to load');
		setIsAdError(true);
	});

	AdMobRewarded.addEventListener('rewardedVideoDidClose', () => {
		logger.log('reward video did close');
		if (!isRewarded) {
			// automatically close the window with a reward token
			// setShowContinue(true);
			setIsAdError(true);
		}
	});

	const attemptToStartAd = async () => {
		setIsAdError(false);
		setIsRewarded(false);
		setIsLoading(true);
		try {
			await AdMobRewarded.requestAdAsync();
			await AdMobRewarded.showAdAsync();
		} catch (er) {
			logger.log(er);
		} finally {
			setIsLoading(false);
		}
	};

	const openSupport = () => {
		Linking.openURL(whatsapp_link);
	};

	return (
		<View>
			<Modal transparent={true} visible={show} onRequestClose={requestClose}>
				<SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
					<StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
					<View style={[{ flexDirection: 'row-reverse' }, GlobalStyle.alignCenter]}>
						<TouchableBtn onPress={() => requestClose(AdPurchaseCloseStatus.CLOSE)}>
							<Ionicons
								name="md-close"
								style={{ padding: 16 }}
								size={26}
								color={Colors.offWhite}
							/>
						</TouchableBtn>
						<View style={GlobalStyle.expand} />
						<Text style={{ fontSize: 16, paddingLeft: 8 }}>Premium Feature</Text>
					</View>

					{!isRewarded && (
						<View
							style={[
								GlobalStyle.column,
								GlobalStyle.justifyCenter,
								GlobalStyle.padding
							]}
						>
							{isAdError && (
								<Value
									style={{ color: 'red', textAlign: 'center', paddingBottom: 4 }}
								>
									AD interrupted or didn't load, you can try again or purchase a
									paid plan for delightful experience.
								</Value>
							)}
							<Value style={{ textAlign: 'center', padding: 4 }}>
								This is a premium feature exclusively for paid members, you can:
							</Value>

							{isLoading && <Throbber size="small" />}
							{!isLoading && (
								<Button
									label="Watch Short Ad to Access for FREE"
									isPrimary={true}
									onPress={attemptToStartAd}
								/>
							)}
							<Value style={{ fontSize: 16, padding: 12, textAlign: 'center' }}>
								Or
							</Value>
							<Button
								label="Skip the Queue, Purchase a Plan"
								isPrimary={true}
								onPress={startPayment}
							/>
							<Value style={{ textAlign: 'center', padding: 4 }}>
								With a paid plan you can directly contact, see profiles in your
								area, see who viewed your profile, find matches according to your
								preferences and much more without any ADs.
							</Value>
							<Value style={{ textAlign: 'center', paddingTop: 16 }}>
								You're seeing this because either you're on a free plan or your
								contact balance is exhausted or your account is expired.
							</Value>
						</View>
					)}
					{isRewarded && (
						<View
							style={[
								GlobalStyle.column,
								GlobalStyle.justifyCenter,
								GlobalStyle.padding
							]}
						>
							<Value style={{ textAlign: 'center', padding: 4 }}>
								You can continue now.
							</Value>
							<Button
								label="Continue →"
								isPrimary={true}
								onPress={() => requestClose(AdPurchaseCloseStatus.REWARDED)}
							/>
						</View>
					)}
					<View style={GlobalStyle.expand} />
					<View style={GlobalStyle.padding}>
						<TouchableBtn onPress={openSupport}>
							<Value style={{ textAlign: 'center' }}>
								We're here to help you. Reach out to our amazing support at{' '}
								{support_number} for any help.
							</Value>
						</TouchableBtn>
					</View>
				</SafeAreaView>
			</Modal>
		</View>
	);
}
