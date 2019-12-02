import * as React from 'react';
import {
	View,
	Text,
	Modal,
	StyleSheet,
	TouchableNativeFeedback,
	ScrollView,
	StatusBar,
	SafeAreaView
} from 'react-native';
import CheckBox from 'react-native-check-box';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { Tag } from '../../store/reducers/account-defination';
import { find, isEmpty, keys, map } from 'lodash';
import Color from '../../constants/Colors';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { Ionicons } from '@expo/vector-icons';

interface ITagSelectorProps {
	tags: Array<Tag>;
	currentTags: Array<Tag>;
	updateTags: (tags: Array<Tag>) => any;
	title: string;
	tagType: string;
}

interface ITagSelectorState {
	selectedTags: {
		[id: number]: boolean;
	};
	showModal: boolean;
}

class TagSelector extends React.Component<ITagSelectorProps, ITagSelectorState> {
	constructor(props: ITagSelectorProps) {
		super(props);
		const selectedTags = {} as any;
		props.tags.forEach(tag => {
			const found = find(props.currentTags, { id: tag.id });
			if (!isEmpty(found)) {
				selectedTags[tag.id] = true;
			}
		});

		this.state = {
			selectedTags,
			showModal: false
		};
	}

	toggleTagSelect(tagId: number) {
		const { selectedTags } = this.state;
		selectedTags[tagId] = !selectedTags[tagId];
		this.setState({
			selectedTags: { ...selectedTags }
		});
	}

	toggleShowModal() {
		const { showModal } = this.state;
		this.setState({
			showModal: !showModal
		});
	}

	onRequestClose() {
		const { tags, updateTags } = this.props;
		const { selectedTags } = this.state;
		const newTags: Array<Tag> = [];
		keys(selectedTags).forEach(id => {
			if (!selectedTags[parseInt(id)]) return;
			const tag: Tag = find(tags, { id: parseInt(id) }) as Tag;
			if (!isEmpty(tag)) {
				newTags.push(tag);
			}
		});

		if (updateTags) {
			updateTags(newTags);
		}
	}

	render() {
		const { tags, title, currentTags } = this.props;
		const { selectedTags, showModal } = this.state;
		const label = map(currentTags, 'value').join(', ');
		return (
			<View>
				<TouchableBtn onPress={() => this.toggleShowModal()}>
					<View style={styles.labelContainer}>
						{isEmpty(currentTags) && <Text style={styles.label}>&nbsp;</Text>}
						{!isEmpty(currentTags) && <Text style={styles.label}>{label}</Text>}
					</View>
				</TouchableBtn>
				<Modal
					animationType="slide"
					transparent={false}
					visible={showModal}
					onRequestClose={() => {
						this.onRequestClose();
						this.toggleShowModal();
					}}
				>
					<View style={styles.flexContainer}>
						<SafeAreaView>
							<StatusBar
								backgroundColor={Color.primaryDarkColor}
								barStyle="light-content"
							/>
							<View style={[styles.container]}>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginRight: 16
									}}
								>
									<Text style={styles.title}>{title || 'No Title'}</Text>
									<View style={{ flex: 1 }} />
									<TouchableBtn onPress={() => this.toggleShowModal()}>
										<Ionicons
											name="md-close"
											size={26}
											color={Color.offWhite}
										/>
									</TouchableBtn>
								</View>
								<ScrollView>
									{tags.map(tag => {
										return (
											<CheckBox
												style={{ flex: 1, padding: 20 }}
												onClick={() => {
													this.toggleTagSelect(tag.id);
												}}
												checkBoxColor={Color.primaryDarkColor}
												isChecked={!!selectedTags[tag.id]}
												key={tag.id}
												rightText={tag.value}
												rightTextStyle={styles.optionLabel}
											/>
										);
									})}
								</ScrollView>
							</View>
						</SafeAreaView>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	flexContainer: {
		flex: 1,
		flexDirection: 'column'
	},
	container: {
		backgroundColor: Color.white,
		padding: 10,
		paddingBottom: 20
	},
	title: {
		color: Color.primaryDarkColor,
		padding: 15,
		fontSize: 18,
		fontWeight: 'bold'
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
	optionLabel: {
		fontSize: 20
	}
});

const mapStateToProps = (state: IRootState, props: ITagSelectorProps) => {
	const tagType = props.tagType || 'test';
	return {
		tags: state.tags[tagType] || []
	};
};

export default connect(
	mapStateToProps,
	null
)(TagSelector);
