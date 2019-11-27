import * as React from 'react';
import Collapsible from 'react-native-collapsible';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Text from '../text/index';
import GlobalStyles from '../../styles/global';
import Table from '../table/index';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { withNavigation } from 'react-navigation';

interface ICollapsibleTableProps {
	title: string;
	object: any;
	navigation: any;
	mapping: any;
	userProfileId: number;
	updateAction: (a: any) => any;
}

interface ICollapsibleTableState {
	expanded: boolean;
}

class CollapsibleTable extends React.Component<ICollapsibleTableProps, ICollapsibleTableState> {
	constructor(props: ICollapsibleTableProps) {
		super(props);

		this.state = {
			expanded: true
		};

		this.toggleExpand = this.toggleExpand.bind(this);
		this.editTable = this.editTable.bind(this);
	}

	toggleExpand() {
		const { expanded } = this.state;
		this.setState({
			expanded: !expanded
		});
	}

	editTable() {
		const { navigation, object, mapping, title, updateAction, userProfileId } = this.props;
		navigation.push('EditProfileScreen', {
			title,
			object,
			mapping,
			updateAction,
			userProfileId
		});
	}

	render() {
		const { title, object, mapping } = this.props;
		const { expanded } = this.state;
		const caretIconName = expanded ? 'md-arrow-dropup' : 'md-arrow-dropdown';
		return (
			<View>
				<View style={[GlobalStyles.row, GlobalStyles.expand]}>
					<TouchableNativeFeedback
						style={GlobalStyles.expand}
						onPress={this.toggleExpand}
					>
						<View
							style={[
								GlobalStyles.row,
								GlobalStyles.alignCenter,
								GlobalStyles.expand
							]}
						>
							<Text style={[GlobalStyles.large, GlobalStyles.expand, styles.title]}>
								{title}
							</Text>
							<TouchableNativeFeedback onPress={this.editTable}>
								<Ionicons
									name="md-create"
									size={20}
									style={styles.headerIcon}
									color={Colors.primaryDarkColor}
								/>
							</TouchableNativeFeedback>
							<Ionicons
								style={styles.headerIcon}
								color={Colors.primaryDarkColor}
								name={caretIconName}
								size={20}
							/>
						</View>
					</TouchableNativeFeedback>
				</View>
				<Collapsible collapsed={!expanded}>
					<View
						// animation="pulse"
						// iterationCount="infinite"
						style={styles.container}
					>
						<Table object={object} mapping={mapping} />
					</View>
				</Collapsible>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	title: {
		padding: 10,
		color: Colors.primaryDarkColor,
		fontWeight: '500'
	},
	headerIcon: {
		paddingRight: 20
	},
	container: {
		padding: 10
	}
});

export default withNavigation(CollapsibleTable);
