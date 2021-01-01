import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';

import { API } from '../config/API';
import { simpleAlert } from '../components/alert';
import { IS_IOS, ApiRequest } from './index';
import { getLogger } from './logger';

async function getPermissionAsync() {
	if (IS_IOS) {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		if (status !== 'granted') {
			simpleAlert(
				'Need Permission',
				'Sorry, we need camera roll permissions to select picture.'
			);
			return false;
		}
	}
	return true;
}

export async function pickPhotoFromGallery() {
	const logger = getLogger(pickPhotoFromGallery);
	try {
		const permitted = await getPermissionAsync();
		if (permitted) {
			const image = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: MediaTypeOptions.Images,
				allowsEditing: true,
				quality: 0.3,
				exif: false,
				aspect: [4, 3]
			});
			if (!image.cancelled) {
				try {
					const uploadedImage = (await ApiRequest(API.PHOTO.UPLOAD, {
						file: {
							uri: image.uri,
							name: 'image.jpg',
							type: 'image/jpeg'
						}
					})) as any;

					if (!uploadedImage) {
						throw new Error('unable to upload photo');
					}

					logger.log(uploadedImage);
					return uploadedImage.url;
				} catch (er) {
					logger.log(er);
				}
			}
		}
	} catch (err) {
		logger.log(err);
		simpleAlert('Error', 'Unknown Error');
	}

	return null;
}
