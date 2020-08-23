import * as React from 'react';
import {
	Image,
	TouchableNativeFeedback,
	View,
	StyleSheet,
	ScrollView,
	Platform
} from 'react-native';
import GlobalStyles from '../../styles/global';
import Text from '../text/index';
import Colors from '../../constants/Colors';
import { TAB_SECTIONS } from './tab-sections';
import { IRootState } from '../../store';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { mayBeFetchSearchResult } from '../../store/reducers/explore-reducer';
import { find } from 'lodash';
import TouchableBtn from '../touchable-btn/touchable-btn';

class TabbedFilters extends React.PureComponent<any> {
	changeSelectedScreen(screen: string) {
		const { mayBeFetchSearchResult } = this.props;
		mayBeFetchSearchResult(screen);
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
							<TouchableBtn
								onPress={() => this.changeSelectedScreen(tab.name)}
								key={tab.name}
							>
								<View style={classes}>
									<Image style={styles.icon} source={tab.icon} />
									<Text style={styles.label}>{tab.label}</Text>
								</View>
							</TouchableBtn>
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
		padding: 20,
		paddingTop: 4
	},
	tile: {
		flexDirection: 'column',
		alignItems: 'center',
		width: 100,
		...Platform.select({
			ios: {
				paddingBottom: 10
			}
		})
	},
	selectedTitle: {
		borderBottomWidth: 2,
		borderColor: Colors.primaryDarkColor
	},
	label: {
		color: Colors.offWhite,
		fontSize: 12,
		textAlign: 'center'
	},
	icon: {
		width: 40,
		height: 40,
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
		mayBeFetchSearchResult: bindActionCreators(mayBeFetchSearchResult, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(TabbedFilters);
