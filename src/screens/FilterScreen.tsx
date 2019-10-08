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
import { IRootState } from '../store';
import { applyFilter, getSearchFilter } from '../store/reducers/filter-reducer';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { omit, isEmpty } from 'lodash';

interface IMapStateToProps {
	filters: any;
	store: IRootState;
}

interface IMapDispatchToProps {
	applyFilter: (filter: any) => any;
}

type IFilterScreenProps = NavigationInjectedProps & IMapStateToProps & IMapDispatchToProps;

class FilterScreen extends React.Component<IFilterScreenProps, any> {
	static navigationOptions = {
		title: 'Filter'
	};

	constructor(props: IFilterScreenProps) {
		super(props);

		const firstOption = Object.keys(TypesOfFilter)[0];

		// include selected search filter from store
		const filters: any = {};
		Object.keys(TypesOfFilter).forEach(key => {
			filters[key] = {};
		});
		this.state = {
			selectedFilter: firstOption,
			filters: {
				...filters,
				...props.filters
			}
		};

		this.setRangeValue = this.setRangeValue.bind(this);
		this.setChoiceValue = this.setChoiceValue.bind(this);
		this.applyFilter = this.applyFilter.bind(this);
	}

	setSelectedFilter(filterKey: string) {
		let filters = this.state.filters;
		/*
			Remove when a selected filter is clicked again while in focus
		*/
		if (this.state.filters[filterKey] && filterKey === this.state.selectedFilter) {
			filters = omit(this.state.filters, [filterKey]);
		}
		this.setState({
			selectedFilter: filterKey,
			filters: { ...filters }
		});
	}

	renderFilterButton(filter: FilterOption, key: string) {
		const { selectedFilter } = this.state;
		const classes: any = [styles.filterBtn];

		if (key === selectedFilter) {
			classes.push(styles.selectedFilter);
		}

		const isFilterEnabled = !isEmpty(this.state.filters[key]);

		return (
			<TouchableNativeFeedback onPress={() => this.setSelectedFilter(key)}>
				<View style={classes}>
					{isFilterEnabled && (
						<Ionicons
							name="md-checkbox-outline"
							size={23}
							style={{ marginBottom: -3, marginRight: 10 }}
							color={Colors.primaryDarkColor}
						/>
					)}
					<Text>{filter.label}</Text>
				</View>
			</TouchableNativeFeedback>
		);
	}

	setRangeValue(range: any) {
		const { selectedFilter } = this.state;
		if (selectedFilter) {
			this.setState({
				filters: {
					...this.state.filters,
					[selectedFilter]: {
						...range
					}
				}
			});
		}
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
		const { navigation, applyFilter: applyFilterToStore } = this.props;
		applyFilterToStore(this.state.filters);
		navigation.goBack();
	}

	render() {
		const { selectedFilter } = this.state;
		const { store } = this.props;
		if (!selectedFilter) return null;
		const { width, height } = Dimensions.get('window');
		const filter = TypesOfFilter[selectedFilter];
		const FilterComponent = filter.component;
		const choices =
			typeof filter.choices === 'function' ? filter.choices(store) : filter.choices;
		const isRangeFilter = !!filter.range;
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
							if (!!filter.hidden) return;
							return (
								<View key={filterKey}>
									{this.renderFilterButton(filter, filterKey)}
								</View>
							);
						})}
					</ScrollView>
					<ScrollView style={GlobalStyles.expand}>
						{isRangeFilter && (
							<FilterComponent
								rangeValue={this.state.filters[selectedFilter]}
								setRangeValue={this.setRangeValue}
								{...filter.range}
							/>
						)}
						{!isRangeFilter && (
							<FilterComponent
								key={selectedFilter}
								choices={choices}
								setChoiceValue={(choiceKey, choiceValue) =>
									this.setChoiceValue(selectedFilter, choiceKey, choiceValue)
								}
								choicesValue={this.state.filters[selectedFilter]}
							/>
						)}
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
		padding: 15,
		flexDirection: 'row'
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

const mapStateToProps = (state: IRootState) => {
	const filters = getSearchFilter(state);
	return {
		filters,
		store: state
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		applyFilter: bindActionCreators(applyFilter, dispatch)
	};
};

const connected = connect(
	mapStateToProps,
	mapDispatchToProps
)(FilterScreen);
export default withNavigation(connected);
