import * as React from 'react';
import { View, ScrollView, StyleSheet, TouchableNativeFeedback, Image, Text } from 'react-native';
import { IRootState } from '../store';
import { UserProfile } from '../store/reducers/account-defination';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';
import { getLogger } from '../utils/logger';
import { Icon } from 'expo';
import { ImagePicker, Permissions, Constants } from 'expo';
import { simpleAlert } from '../components/alert';
import ActionSheet from 'react-native-actionsheet';
import { Throbber } from '../components/throbber/throbber';
import Colors from 'src/constants/Colors.js';
import {
	getCurrentUserProfile,
	getIsCurrentProfileUpdating
} from '../store/reducers/self-profile-reducer';
import { uploadPhoto } from 'src/store/reducers/user-profile-reducer.ts';
import { bindActionCreators, Dispatch } from 'redux';
import Layout from 'src/constants/Layout.js';

interface IPassedInProps extends NavigationInjectedProps {}

interface IMapStateToProps {
	userProfile?: UserProfile;
	isCurrentProfileUpdating: boolean;
}

interface IMapDispatchToProps {
	uploadPhoto: any;
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
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				simpleAlert(
					'Need Permission',
					'Sorry, we need camera roll permissions to make this work!'
				);
			}
		}
	};

	_pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'Images',
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
				<TouchableNativeFeedback key={i} onPress={() => this.showImageActions(i)}>
					<View style={styles.imageContainer}>
						<Image
							source={{ uri: photo.url, width: tileWidth, height: tileHeight }}
							style={{ width: tileWidth, height: tileHeight }}
						/>
					</View>
				</TouchableNativeFeedback>
			);
		});
	}

	render() {
		const { userProfile, isCurrentProfileUpdating } = this.props;
		if (!userProfile) return null;
		return (
			<View style={styles.imageGalleryContainer}>
				<ScrollView>
					<View style={styles.tilesContainer}>{this.getPhotoTiles()}</View>
				</ScrollView>
				<View style={styles.addBtnContainer}>
					<TouchableNativeFeedback onPress={this._pickImage}>
						<View style={styles.addIconContainer}>
							<Icon.Ionicons name="md-add" size={30} color="white" />
						</View>
					</TouchableNativeFeedback>
				</View>
				<ActionSheet
					ref={o => (this.imageActionSheet = o)}
					// title={'Perform action'}
					options={['Make it primary', 'Delete photo', 'Cancel']}
					cancelButtonIndex={2}
					destructiveButtonIndex={1}
					onPress={index => {
						this.logger.log(index);
						this.setState({
							selectedIndex: index
						});
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
		borderRadius: 30,
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
		uploadPhoto: bindActionCreators(uploadPhoto, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileImageGalleryScreen);
