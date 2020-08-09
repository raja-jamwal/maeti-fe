import * as React from 'react';
import { View, Text, Modal, StyleSheet, TextInput, StatusBar, SafeAreaView } from 'react-native';
import Color from '../../constants/Colors';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { ModalCloseButton } from '../modal-close-button';
import { Ionicons } from '@expo/vector-icons';

interface IAboutFieldProps {
	value: string;
	onChangeText: (value: string) => any;
}

interface IAboutFieldState {
	showModal: boolean;
}

class AboutField extends React.PureComponent<IAboutFieldProps, IAboutFieldState> {
	constructor(props: any) {
		super(props);
		this.state = {
			showModal: false
		};
	}

	toggleShowModal() {
		const { showModal } = this.state;
		this.setState({
			showModal: !showModal
		});
	}

	render() {
		const { showModal } = this.state;
		const { value, onChangeText } = this.props;
		return (
			<View>
				<TouchableBtn onPress={() => this.toggleShowModal()}>
					<View style={styles.labelContainer}>
						<Text
							style={[
								styles.label,
								{ paddingTop: 4, paddingBottom: 4 },
								!value ? { color: Color.offWhite } : {}
							]}
						>
							{value || 'Write your story...'}
						</Text>
					</View>
				</TouchableBtn>
				<Modal
					animationType="slide"
					visible={showModal}
					onRequestClose={() => {
						this.toggleShowModal();
					}}
				>
					<SafeAreaView>
						<StatusBar
							backgroundColor={Color.primaryDarkColor}
							barStyle="light-content"
						/>
						<View style={styles.container}>
							<View style={{ flexDirection: 'row' }}>
								<Text style={styles.title}>About</Text>
								<View style={{ flex: 1 }} />
								<TouchableBtn onPress={() => this.toggleShowModal()}>
									<View
										style={{
											padding: 12
										}}
									>
										<Ionicons
											name="md-close"
											size={35}
											color={Color.offWhite}
										/>
									</View>
								</TouchableBtn>
							</View>
							<View style={styles.editorContainer}>
								<TextInput
									onChangeText={text => onChangeText(text)}
									value={value}
									multiline={true}
									placeholder={'Click here and start typing...'}
									style={styles.editBox}
								/>
							</View>
						</View>
					</SafeAreaView>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		margin: 16
	},
	editorContainer: {
		flexDirection: 'column'
	},
	editBox: {
		padding: 15,
		fontSize: 18,
		fontWeight: 'bold'
	},
	item: {
		flex: 1,
		padding: 15
	},
	labelContainer: {
		borderColor: Color.borderColor,
		borderStyle: 'solid',
		borderWidth: 1,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 4
	},
	label: {
		fontSize: 16
	},
	title: {
		color: Color.primaryDarkColor,
		padding: 15,
		fontSize: 18,
		fontWeight: 'bold'
	}
});

export default AboutField;
