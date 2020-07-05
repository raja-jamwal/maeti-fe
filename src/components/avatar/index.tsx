import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
const defaultProfileImage = require('../../assets/images/placeholder.png');

interface IPROPS {
	userProfileImage?: string;
}

export function Avatar({ userProfileImage }: IPROPS) {
	return (
		<View>
			{!!userProfileImage && (
				<Image
					source={{
						uri: userProfileImage
					}}
					style={styles.avatar}
				/>
			)}
			{!userProfileImage && <Image source={defaultProfileImage} style={styles.avatar} />}
		</View>
	);
}

const styles = StyleSheet.create({
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20
	}
});
