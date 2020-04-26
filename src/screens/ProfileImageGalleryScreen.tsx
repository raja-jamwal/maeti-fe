import * as React from 'react';
import { View, ScrollView, StyleSheet, TouchableNativeFeedback, Image, Text } from 'react-native';
import { IRootState } from '../store';
import { PhotosEntity, UserProfile } from '../store/reducers/account-defination';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';
import { getLogger } from '../utils/logger';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { simpleAlert } from '../components/alert';
import ActionSheet from 'react-native-actionsheet';
import { remove } from 'lodash';
import { Throbber } from '../components/throbber/throbber';
import Colors from 'src/constants/Colors.js';
import {
	getCurrentUserProfile,
	getIsCurrentProfileUpdating
} from '../store/reducers/self-profile-reducer';
import { uploadPhoto, updatePhoto } from 'src/store/reducers/user-profile-reducer';
import { bindActionCreators, Dispatch } from 'redux';
import Layout from 'src/constants/Layout.js';
import { MediaTypeOptions } from 'expo-image-picker';
import { IS_IOS } from '../utils';
import TouchableBtn from '../components/touchable-btn/touchable-btn';

enum PHOTO_ACTIONS {
	PRIMARY = 0,
	DELETE = 1,
	CANCEL = 2
}

interface IPassedInProps extends NavigationInjectedProps {}

interface IMapStateToProps {
	userProfile?: UserProfile;
	isCurrentProfileUpdating: boolean;
}

interface IMapDispatchToProps {
	uploadPhoto: any;
	updatePhoto: (photos: PhotosEntity[]) => any;
}

interface IState {
	selectedIndex: number;
}

type IProfileImageGalleryScreenProps = IMapStateToProps & IPassedInProps & IMapDispatchToProps;

class ProfileImageGalleryScreen extends React.Component<IProfileImageGalleryScreenProps, IState> {
	logger = getLogger(ProfileImageGalleryScreen);
	imageActionSheet: ActionSheet | null = null;

	static navigationOptions = {
		title: 'Profile Photo Gallery'
	};

	constructor(props: IProfileImageGalleryScreenProps) {
		super(props);
		this.state = {
			selectedIndex: -1
		};
		this._pickImage = this._pickImage.bind(this);
		this.showImageActions = this.showImageActions.bind(this);
	}

	componentDidMount() {
		this.getPermissionAsync();
	}

	getPermissionAsync = async () => {
		if (IS_IOS) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				simpleAlert(
					'Need Permission',
					'Sorry, we need camera roll permissions to make this work!'
				);
				return false;
			}
		}
		return true;
	};

	_pickImage = async () => {
		const permitted = await this.getPermissionAsync();
		if (!permitted) return;
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: MediaTypeOptions.Images,
			allowsEditing: true,
			quality: 0.5,
			aspect: [4, 3]
		});

		this.logger.log(result);

		if (!result.cancelled) {
			this.props.uploadPhoto({
				uri: result.uri,
				name: 'image.jpg',
				type: 'image/jpeg'
			});
		}
	};

	getPhotos() {
		const { userProfile } = this.props;
		if (!userProfile) return [];
		return userProfile.photo;
	}

	showImageActions(index: number) {
		if (this.imageActionSheet) {
			this.setState({
				selectedIndex: index
			});
			this.imageActionSheet.show();
		}
	}

	getPhotoTiles() {
		const tileWidth = Layout.window.width / 2 - 20;
		const tileHeight = tileWidth;
		return this.getPhotos().map((photo, i) => {
			return (
				<TouchableBtn key={i} onPress={() => this.showImageActions(i)}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: photo.url, width: tileWidth, height: tileHeight }}
							style={{ width: tileWidth, height: tileHeight }}
						/>
					</View>
				</TouchableBtn>
			);
		});
	}

	handlePhotoAction(action: PHOTO_ACTIONS) {
		const { selectedIndex } = this.state;
		const { userProfile, updatePhoto } = this.props;
		if (!userProfile || selectedIndex === -1) return;

		const photoArrayWithoutSelected = ([] as PhotosEntity[]).concat(userProfile.photo);
		const selectedPhoto = userProfile.photo[selectedIndex];
		if (!selectedPhoto) return;
		remove(photoArrayWithoutSelected, selectedPhoto);

		if (action === PHOTO_ACTIONS.PRIMARY) {
			this.logger.log('Making photo primary');
			const updatedPhotoArray = [selectedPhoto].concat(photoArrayWithoutSelected);
			updatePhoto(updatedPhotoArray);
		}

		if (action === PHOTO_ACTIONS.DELETE && this.getPhotos().length > 1) {
			this.logger.log('deleting photo');
			updatePhoto(photoArrayWithoutSelected);
		}
	}

	render() {
		const isDeleteAllowed = this.getPhotos().length > 1;
		let cancelButton = 1;
		const options = [];
		if (isDeleteAllowed) {
			options.push('Make it primary', 'Delete photo', 'Cancel');
			cancelButton = PHOTO_ACTIONS.CANCEL;
		} else {
			options.push('Make it primary', 'Cancel');
		}
		this.logger.log(`Options   ${options}`);
		const { userProfile, isCurrentProfileUpdating } = this.props;
		if (!userProfile) return null;
		return (
			<View style={styles.imageGalleryContainer}>
				<ScrollView>
					<View style={styles.tilesContainer}>{this.getPhotoTiles()}</View>
				</ScrollView>
				<View style={styles.addBtnContainer}>
					<TouchableBtn onPress={this._pickImage}>
						<View style={styles.addIconContainer}>
							<Ionicons name="md-add" size={30} color="white" />
						</View>
					</TouchableBtn>
				</View>
				<ActionSheet
					ref={o => (this.imageActionSheet = o)}
					// title={'Perform action'}
					options={options}
					cancelButtonIndex={cancelButton}
					destructiveButtonIndex={PHOTO_ACTIONS.DELETE}
					onPress={index => {
						this.logger.log(index);
						this.handlePhotoAction(index as PHOTO_ACTIONS);
					}}
				/>
				{isCurrentProfileUpdating && (
					<View style={styles.progressContainer}>
						<View style={styles.progress}>
							<Throbber size="large" />
							<Text style={styles.uploadingText}>uploading</Text>
						</View>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	imageGalleryContainer: {
		flex: 1
	},
	tilesContainer: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	imageContainer: {
		backgroundColor: Colors.tabIconDefault,
		margin: 10
	},
	addBtnContainer: {
		position: 'absolute',
		right: 30,
		bottom: 30,
		backgroundColor: Colors.primaryDarkColor,
		borderRadius: 50,
		width: 50,
		height: 50,
		elevation: 6,
		zIndex: 1
	},
	addIconContainer: {
		margin: 10,
		marginLeft: 15,
		marginRight: 15
	},
	progressContainer: {
		position: 'absolute',
		flex: 1,
		flexDirection: 'column',
		width: Layout.window.width,
		height: Layout.window.height,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		zIndex: 2
	},
	progress: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		top: -100
	},
	uploadingText: {
		color: Colors.primaryDarkColor,
		margin: 20
	}
});

const mapStateToProps = (state: IRootState) => {
	return {
		userProfile: getCurrentUserProfile(state),
		isCurrentProfileUpdating: getIsCurrentProfileUpdating(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		uploadPhoto: bindActionCreators(uploadPhoto, dispatch),
		updatePhoto: bindActionCreators(updatePhoto, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileImageGalleryScreen);
