import * as React from 'react';
import { Image, CacheManager } from 'react-native-expo-image-cache';
import Layout from 'src/constants/Layout.js';
import { StyleSheet } from 'react-native';

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
	return (
		<Image
			style={[
				styles.profileImage,
				{ width: Layout.window.width, height: Layout.window.height / 2 }
			]}
			uri={imageUrl}
		/>
	);
}

const styles = StyleSheet.create({
	profileImage: {
		width: 100,
		height: 200,
		resizeMode: 'cover'
	}
});
