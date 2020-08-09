import * as React from 'react';
import { Image, CacheManager } from 'react-native-expo-image-cache';
import Layout from 'src/constants/Layout.js';
import { StyleSheet } from 'react-native';
const defaultPrimaryPhoto = require('../../assets/images/placeholder.png');

export function FastImage({ url, thumbUrl } = { url: '', thumbUrl: '' }) {
	const [imageUrl, setImageUrl] = React.useState(url);
	React.useEffect(() => {
		CacheManager.get(url, {})
			.getPath()
			.then(path => {
				if (!!path) {
					setImageUrl(path);
				}
			});
	}, []);
	// we'll use it later
	const additionalParams: any = {};
	if (thumbUrl) {
		additionalParams.preview = {
			uri: defaultPrimaryPhoto.uri,
			...{ width: Layout.window.width, height: Layout.window.height / 2 }
		};
	}
	return (
		<Image
			style={[
				styles.profileImage,
				{ width: Layout.window.width, height: Layout.window.height / 2 }
			]}
			uri={imageUrl}
			tint="dark"
			{...additionalParams}
		/>
	);
}

const styles = StyleSheet.create({
	profileImage: {
		resizeMode: 'cover'
	}
});
