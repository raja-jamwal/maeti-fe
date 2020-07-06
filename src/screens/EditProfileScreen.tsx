import * as React from 'react';
import { EmitterSubscription, Modal, StatusBar, View } from 'react-native';
import GlobalStyles from '../styles/global';
import Text from '../components/text/index';
import { Throbber } from '../components/throbber/throbber';
import { getLogger } from '../utils/logger';
import Color from '../constants/Colors';
import { EditableForm } from '../components/editable-form';

const CustomProgressBar = ({ visible, label = 'Saving' }) => (
	<Modal onRequestClose={() => null} visible={visible}>
		<StatusBar backgroundColor={Color.white} barStyle="dark-content" />
		<View
			style={{
				flex: 1,
				backgroundColor: 'rgb(255, 255, 255)',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<View>
				<Text style={{ fontSize: 20, fontWeight: '200', marginBottom: 10 }}>{label}</Text>
				<Throbber size="large" />
			</View>
		</View>
	</Modal>
);

interface IEditProfileScreenState {
	showProgress: boolean;
}

export default class EditProfileScreen extends React.Component<any, IEditProfileScreenState> {
	static navigationOptions = ({ navigation }) => {
		const title = navigation.getParam('title', 'Information');
		return {
			title: `Edit ${title}`
		};
	};

	logger = getLogger(EditProfileScreen);

	keyboardEventListeners: EmitterSubscription[] = [];

	constructor(props: any) {
		super(props);
		this.state = {
			showProgress: false
		};
		this.updateInformation = this.updateInformation.bind(this);
	}

	getObjectAndMapping() {
		const { navigation } = this.props;
		const object = navigation.getParam('object', {});
		const mapping = navigation.getParam('mapping', {});
		return {
			object,
			mapping
		};
	}

	async updateInformation(object: any) {
		const { navigation } = this.props;
		const updateAction = navigation.getParam('updateAction', null);
		const userProfileId = navigation.getParam('userProfileId', null);

		if (!userProfileId || !updateAction) {
			return;
		}

		this.setState({
			showProgress: true
		});

		if (!updateAction || !userProfileId) return null;
		await updateAction({ userProfileId, object });

		this.setState({
			showProgress: false
		});

		navigation.goBack();
	}

	render() {
		const { object, mapping } = this.getObjectAndMapping();
		const { showProgress } = this.state;
		return (
			<View style={GlobalStyles.expand}>
				<StatusBar backgroundColor={Color.white} barStyle="dark-content" />
				<EditableForm
					navObject={object}
					mapping={mapping}
					updateAction={this.updateInformation}
				/>
				{showProgress && <CustomProgressBar visible={true} />}
			</View>
		);
	}
}
