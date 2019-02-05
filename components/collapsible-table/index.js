import React from 'react';
import Collapsible from 'react-native-collapsible';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableNativeFeedback } from 'react-native';
import Text from '../text';
import GlobalStyles from '../../styles/global';
import Table from '../table';
import { Icon } from 'expo';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/samples/ExpoLinksView';
import { withNavigation } from 'react-navigation';

class CollapsibleTable extends React.Component {
	constructor(props) {
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
		const { navigation, object, mapping, title } = this.props;
		navigation.push('EditProfileScreen', { title, object, mapping });
	}

	render() {
		const { title, object, mapping, router } = this.props;
		// console.warn(router);
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
								<Icon.Ionicons
									name="md-create"
									size={20}
									style={styles.headerIcon}
									color={Colors.primaryDarkColor}
								/>
							</TouchableNativeFeedback>
							<Icon.Ionicons
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
		color: Colors.pink,
		fontWeight: '500'
	},
	headerIcon: {
		paddingRight: 20
	},
	container: {
		padding: 10
	}
});

CollapsibleTable.propTypes = {
	title: PropTypes.string.isRequired,
	object: PropTypes.object.isRequired
};

export default withNavigation(CollapsibleTable);
