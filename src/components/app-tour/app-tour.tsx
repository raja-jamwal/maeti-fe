import * as React from 'react';
import {
	View,
	Text,
	SafeAreaView,
	Image,
	StatusBar,
	TouchableOpacity,
	StyleSheet
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Layout from 'src/constants/Layout';
import Colors from 'src/constants/Colors';
import { IS_IOS } from '../../utils';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { noop } from 'lodash';

const tour = [
	{
		text: 'Discover new profiles every day',
		image: require('src/assets/tour/explore-screen.jpg')
	},
	{
		text: 'Find education, profession, family, relatives',
		image: require('src/assets/tour/my-profile.jpg')
	},
	{
		text: '20+ filters to choose from',
		image: require('src/assets/tour/filter-screen.jpg')
	},
	{
		text: 'Like a profile, favourite a profile',
		image: require('src/assets/tour/favourite-screen.jpg')
	},
	{
		text: 'Send, receive and accept interest',
		image: require('src/assets/tour/interest-screen.jpg')
	},
	{
		text: 'Start conversation with your interests',
		image: require('src/assets/tour/channel-listing.jpg')
	},
	{
		text: 'Chat with your interests',
		image: require('src/assets/tour/inbox.jpg')
	}
];

const styles = StyleSheet.create({
	btn: {
		padding: 16,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	}
});

export default function AppTour({ onSkip } = { onSkip: noop }) {
	const [activeIndex, setActiveIndex] = React.useState(0);
	const renderItem = ({ item } = {}) => {
		const { image } = item;
		if (!image) return null;
		return (
			<Image
				progressiveRenderingEnabled={true}
				source={image}
				resizeMode="contain"
				style={[
					{
						width: Layout.window.width,
						height: Layout.window.height - 50,
						resizeMode: 'contain'
					}
				]}
			/>
		);
	};
	const renderButton = () => {
		const Label = () => (
			<View style={styles.btn}>
				<Text style={{ color: Colors.offWhite }}>Skip Tour</Text>
			</View>
		);
		if (IS_IOS) {
			return (
				<TouchableOpacity onPress={onSkip}>
					<Label />
				</TouchableOpacity>
			);
		} else {
			return (
				<TouchableNativeFeedback onPress={onSkip}>
					<Label />
				</TouchableNativeFeedback>
			);
		}
	};

	const renderText = () => {
		const image = tour[activeIndex];
		return (
			<View
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: Layout.window.width,
					height: 130,
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<Text style={{ color: Colors.offWhite }}>{image.text}</Text>
			</View>
		);
	};

	return (
		<SafeAreaView
			style={{ flexDirection: 'column-reverse', flex: 1, backgroundColor: Colors.white }}
		>
			<StatusBar hidden={true} backgroundColor={Colors.white} barStyle="dark-content" />
			{renderButton()}
			<View
				style={{
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: Layout.window.height - 80
				}}
			>
				<Carousel
					data={tour}
					renderItem={renderItem}
					sliderWidth={Layout.window.width}
					itemWidth={Layout.window.width}
					onSnapToItem={index => {
						if (index === tour.length - 1) {
							setTimeout(onSkip, 1000);
						}
						setActiveIndex(index);
					}}
				/>
				<Pagination
					dotsLength={tour.length}
					activeDotIndex={activeIndex}
					inactiveDotOpacity={0.4}
					inactiveDotScale={0.6}
				/>
			</View>
			{renderText()}
		</SafeAreaView>
	);
}
