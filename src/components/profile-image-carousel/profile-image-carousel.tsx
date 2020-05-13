import * as React from 'react';
import { UserProfile } from '../../store/reducers/account-defination';
import { Image, StyleSheet, TouchableHighlight, View } from 'react-native';
import Layout from 'src/constants/Layout.js';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { getLogger } from '../../utils/logger';
import { IS_IOS } from '../../utils';

const defaultPrimaryPhoto = require('../../assets/images/placeholder.png');

interface IProps {
	userProfile?: UserProfile;
	onPress?: () => any;
	isSelfProfile?: Boolean;
	showCarousel?: Boolean;
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
		this.renderItem = this.renderItem.bind(this);
	}

	renderItem = ({ item }) => {
		const { onPress } = this.props;
		const image = item;
		if (!image) return null;
		return (
			<TouchableHighlight onPress={() => onPress && onPress()}>
				<Image
					loadingIndicatorSource={defaultPrimaryPhoto}
					progressiveRenderingEnabled={true}
					source={{
						uri: image.url,
						width: Layout.window.width
					}}
					style={[
						styles.profileImage,
						{ width: Layout.window.width, height: Layout.window.height / 2 }
					]}
				/>
			</TouchableHighlight>
		);
	};

	getApprovedPhotos() {
		const { userProfile, isSelfProfile, onPress } = this.props;
		if (!userProfile) return [];
		return isSelfProfile ? userProfile.photo : userProfile.photo.filter(p => !!p.isApproved);
	}

	// ios flat list rendering issue
	mayBeRenderCarousel() {
		const { showCarousel } = this.props;
		if (IS_IOS) {
			if (showCarousel) {
				return this.renderWithCarousel();
			} else {
				return this.renderWithoutCarousel();
			}
		}

		// for android we show carousel in list
		return this.renderWithCarousel();
	}

	renderWithoutCarousel() {
		const { onPress } = this.props;
		const approvedPhotos = this.getApprovedPhotos();
		const image = approvedPhotos.length
			? { uri: approvedPhotos[0].url, width: Layout.window.width }
			: defaultPrimaryPhoto;
		return (
			<View>
				<TouchableHighlight onPress={() => onPress && onPress()}>
					<Image
						loadingIndicatorSource={defaultPrimaryPhoto}
						progressiveRenderingEnabled={true}
						source={image}
						style={[
							styles.profileImage,
							{ width: Layout.window.width, height: Layout.window.height / 2 }
						]}
					/>
				</TouchableHighlight>
			</View>
		);
	}

	renderWithCarousel() {
		const { userProfile } = this.props;
		const { activeIndex } = this.state;
		if (!userProfile) return null;
		this.logger.log('userProfile', userProfile.photo.length);
		const approvedPhotos = this.getApprovedPhotos();
		return (
			<View>
				<Carousel
					data={approvedPhotos}
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
						width: 5,
						height: 5,
						borderRadius: 5,
						backgroundColor: 'rgba(0, 0, 0, 0.6)'
					}}
					inactiveDotOpacity={0.4}
					inactiveDotScale={0.6}
				/>
			</View>
		);
	}

	render() {
		return this.mayBeRenderCarousel();
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
		bottom: -45
	}
});
