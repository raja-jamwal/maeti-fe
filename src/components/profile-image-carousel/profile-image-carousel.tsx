import * as React from 'react';
import { UserProfile } from '../../store/reducers/account-defination';
import { Image, StyleSheet, View } from 'react-native';
import Layout from 'src/constants/Layout.js';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getLogger } from '../../utils/logger';

interface IProps {
	userProfile?: UserProfile;
}

interface IState {
	activeIndex: number;
}

export default class ProfileImageCarousel extends React.PureComponent<IProps, IState> {
	logger = getLogger(ProfileImageCarousel);

	constructor(props: IProps) {
		super(props);
		this.state = {
			activeIndex: 0
		};
	}

	renderItem = ({ item }) => {
		const image = item;
		if (!image) return null;
		return (
			<Image
				source={{
					uri: image.url,
					width: Layout.window.width
				}}
				style={[styles.profileImage, { width: Layout.window.width, height: Layout.window.height / 2 }]}
			/>
		);
	};

	render() {
		const { userProfile } = this.props;
		const { activeIndex } = this.state;
		if (!userProfile) return null;
		this.logger.log('userProfile', userProfile.photo.length);
		return (
			<View>
				<Carousel
					data={userProfile.photo}
					renderItem={this.renderItem}
					sliderWidth={Layout.window.width}
					itemWidth={Layout.window.width}
					onSnapToItem={index => this.setState({ activeIndex: index })}
				/>
				<Pagination
					dotsLength={userProfile.photo.length}
					activeDotIndex={activeIndex}
					containerStyle={styles.paginationContainer}
					dotStyle={{
						width: 10,
						height: 10,
						borderRadius: 5,
						backgroundColor: 'rgba(0, 0, 0, 0.6)'
					}}
					inactiveDotOpacity={0.4}
					inactiveDotScale={0.6}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	profileImage: {
		width: 100,
		height: 200,
		resizeMode: 'cover'
	},
	paginationContainer: {
		position: 'absolute',
		width: Layout.window.width,
		bottom: -60,
	}
});
