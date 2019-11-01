import * as React from 'react';
import { View, Text, TouchableNativeFeedback, Modal, StyleSheet, TextInput } from 'react-native';
import Color from '../../constants/Colors';

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
				<TouchableNativeFeedback onPress={() => this.toggleShowModal()}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>{value || ''}</Text>
					</View>
				</TouchableNativeFeedback>
				<Modal
					animationType="slide"
					// transparent={true}
					visible={showModal}
					onRequestClose={() => {
						this.toggleShowModal();
					}}
				>
					<View style={styles.container}>
						<Text style={styles.title}>About</Text>
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
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column'
	},
	editorContainer: {
		flex: 1,
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
