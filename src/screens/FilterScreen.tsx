import * as React from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableNativeFeedback,
	StyleSheet,
	Dimensions
} from 'react-native';
import GlobalStyles from '../styles/global';
import Colors from '../constants/Colors';
import { FilterOption, TypesOfFilter } from '../components/search-filters';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';

class FilterScreen extends React.Component<NavigationInjectedProps, any> {
	static navigationOptions = {
		title: 'Filter'
	};

	constructor(props: any) {
		super(props);

		const firstOption = Object.keys(TypesOfFilter)[0];

		// this should come from store
		const filters: any = {};

		Object.keys(TypesOfFilter).forEach(key => {
			filters[key] = {};
		});

		this.state = {
			selectedFilter: firstOption,
			filters
		};

		this.applyFilter = this.applyFilter.bind(this);
	}

	setSelectedFilter(filterKey: string) {
		this.setState({
			selectedFilter: filterKey
		});
	}

	renderFilerButton(filter: FilterOption, key: string) {
		const { selectedFilter } = this.state;
		const classes: any = [styles.filterBtn];

		if (key === selectedFilter) {
			classes.push(styles.selectedFilter);
		}

		return (
			<TouchableNativeFeedback onPress={() => this.setSelectedFilter(key)}>
				<View style={classes}>
					<Text>{filter.label}</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}

	setChoiceValue(filterName: string, choiceKey: string, choiceValue: string) {
		const { selectedFilter } = this.state;
		console.log('setChoiceValue ', filterName, choiceKey, choiceValue);
		if (filterName) {
			this.setState({
				filters: {
					...this.state.filters,
					[selectedFilter]: {
						...this.state.filters[selectedFilter],
						[choiceKey]: choiceValue
					}
				}
			});
		}
	}

	clearAllFilters() {
		this.setState({
			filters: {}
		});
	}

	applyFilter() {
		const { navigation } = this.props;
		/*
			Push selected filter to state
			change the explore-screen state in store
		 */
		navigation.goBack();
	}

	render() {
		const { selectedFilter } = this.state;
		if (!selectedFilter) return null;
		const { width, height } = Dimensions.get('window');
		const filter = TypesOfFilter[selectedFilter];
		const FilterComponent = filter.component;
		const choices = filter.choices;
		return (
			<View style={GlobalStyles.expand}>
				<View style={[GlobalStyles.row, { height: height - 200 }]}>
					<ScrollView
						style={{
							width: 8
						}}
					>
						{Object.keys(TypesOfFilter).map((filterKey: string) => {
							const filter = TypesOfFilter[filterKey];
							return (
								<View key={filterKey}>
									{this.renderFilerButton(filter, filterKey)}
								</View>
							);
						})}
					</ScrollView>
					<ScrollView style={GlobalStyles.expand}>
						{
							<FilterComponent
								choices={choices}
								setChoiceValue={(choiceKey, choiceValue) =>
									this.setChoiceValue(selectedFilter, choiceKey, choiceValue)
								}
								choicesValue={this.state.filters[selectedFilter]}
							/>
						}
					</ScrollView>
				</View>

				<View style={GlobalStyles.row}>
					{/*<TouchableNativeFeedback onPress={() => null}>
						<View
							style={[
								GlobalStyles.row,
								GlobalStyles.expand,
								GlobalStyles.justifyCenter,
								styles.actionBtn,
								styles.secondaryBtn
							]}
						>
							<Text>Save Filter</Text>
						</View>
					</TouchableNativeFeedback>*/}
					<TouchableNativeFeedback onPress={() => this.clearAllFilters()}>
						<View
							style={[
								GlobalStyles.row,
								GlobalStyles.expand,
								GlobalStyles.justifyCenter,
								styles.actionBtn,
								styles.secondaryBtn
							]}
						>
							<Text>Clear All</Text>
						</View>
					</TouchableNativeFeedback>
					<TouchableNativeFeedback onPress={this.applyFilter}>
						<View
							style={[
								GlobalStyles.row,
								GlobalStyles.expand,
								GlobalStyles.justifyCenter,
								styles.actionBtn,
								styles.primaryBtn
							]}
						>
							<Text style={styles.primaryBtnText}>Apply</Text>
						</View>
					</TouchableNativeFeedback>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	filterBtn: {
		borderTopWidth: 0,
		borderWidth: 1,
		borderColor: Colors.borderColor,
		padding: 15
	},
	selectedFilter: {
		borderLeftColor: Colors.pink,
		borderLeftWidth: 5
	},
	secondaryBtn: {
		borderWidth: 1,
		borderColor: Colors.primaryDarkColor
	},
	actionBtn: {
		// padding: 10
		paddingTop: 5,
		paddingBottom: 5,
		margin: 5
	},
	primaryBtn: {
		backgroundColor: Colors.primaryDarkColor
	},
	primaryBtnText: {
		color: Colors.white
	}
});

export default withNavigation(FilterScreen);
