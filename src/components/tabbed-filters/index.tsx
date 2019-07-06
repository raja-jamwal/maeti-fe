import * as React from 'react';
import { Image, TouchableNativeFeedback, View, StyleSheet, ScrollView } from 'react-native';
import GlobalStyles from '../../styles/global';
import Text from '../text/index';
import Colors from '../../constants/Colors';
import { TAB_SECTIONS } from './tab-sections';
import { IRootState } from '../../store';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { changeSelectedExploreScreen } from '../../store/reducers/explore-reducer';
import { find } from 'lodash';

class TabbedFilters extends React.Component<any, any> {
	changeSelectedScreen(screen: string) {
		const { changeSelectedExploreScreen } = this.props;
		changeSelectedExploreScreen(screen);
	}

	findSelectedTab(name: string) {
		return find(TAB_SECTIONS, { name });
	}

	render() {
		const { selected_screen } = this.props;
		const selectedTab = this.findSelectedTab(selected_screen);
		if (!selectedTab) return null;
		return (
			<View>
				<View>
					<Text style={styles.headline}>Choose a type of match</Text>
				</View>
				<ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					style={GlobalStyles.row}
				>
					{TAB_SECTIONS.map(tab => {
						const classes: any = [styles.tile];
						if (tab.name === selected_screen) {
							classes.push(styles.selectedTitle);
						}
						return (
							<TouchableNativeFeedback
								onPress={() => this.changeSelectedScreen(tab.name)}
								key={tab.name}
							>
								<View style={classes}>
									<Image style={styles.icon} source={tab.icon} />
									<Text style={styles.label}>{tab.label}</Text>
								</View>
							</TouchableNativeFeedback>
						);
					})}
				</ScrollView>
				<View>
					<Text style={styles.headline}>{selectedTab.label}</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	headline: {
		fontSize: 25,
		fontWeight: '500',
		padding: 20
	},
	tile: {
		flexDirection: 'column',
		alignItems: 'center',
		width: 120
	},
	selectedTitle: {
		borderBottomWidth: 2,
		borderColor: Colors.orange
	},
	label: {
		color: Colors.offWhite,
		textAlign: 'center'
	},
	icon: {
		width: 80,
		height: 80,
		resizeMode: 'contain'
	}
});

const mapStateToProps = (state: IRootState) => {
	const selected_screen = state.explore.selected_screen;
	return {
		selected_screen
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		changeSelectedExploreScreen: bindActionCreators(changeSelectedExploreScreen, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TabbedFilters);
