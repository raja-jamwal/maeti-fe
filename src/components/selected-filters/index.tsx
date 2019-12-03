import * as React from 'react';
import { View, Text, ScrollView, TouchableNativeFeedback, StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/global';
import { connect } from 'react-redux';
import { IRootState } from '../../store';
import { applyFilter, getSearchFilter } from '../../store/reducers/filter-reducer';
import { FilterOption, TypesOfFilter } from '../search-filters';
import { Ionicons } from '@expo/vector-icons';
import { isEmpty } from 'lodash';
import Colors from 'src/constants/Colors';
import { getSelectedScreen } from '../../store/reducers/explore-reducer';
import { bindActionCreators } from 'redux';
import TouchableBtn from '../touchable-btn/touchable-btn';

interface ISelectedFilterMapStateToProps {
	filters: any;
	selectedScreen: string;
}

interface ISelectedFilterMapDispatchToProps {
	applyFilter: (filters: any) => any;
}

interface IFilterBreadCrum {
	key: string;
	filter: FilterOption;
}

type ISelectedFilterProps = ISelectedFilterMapStateToProps & ISelectedFilterMapDispatchToProps;

class SelectedFilter extends React.Component<ISelectedFilterProps> {
	constructor(props: ISelectedFilterProps) {
		super(props);
		this.getSelectedFilters = this.getSelectedFilters.bind(this);
		this.renderFilterButton = this.renderFilterButton.bind(this);
	}

	getApplicableFilters(): string[] {
		const { filters } = this.props;
		return Object.keys(filters)
			.map(key => {
				if (isEmpty(filters[key])) return;
				return key;
			})
			.filter(p => !!p) as string[];
	}

	getSelectedFilters(): IFilterBreadCrum[] {
		return this.getApplicableFilters().map(key => {
			return {
				key,
				filter: TypesOfFilter[key]
			};
		});
	}

	removeFilter(key: string) {
		// avoid mutating source
		const filters = { ...this.props.filters };
		delete filters[key];
		this.props.applyFilter(filters);
	}

	renderFilterButton(breadCrum: IFilterBreadCrum) {
		return (
			<TouchableBtn key={breadCrum.key} onPress={() => this.removeFilter(breadCrum.key)}>
				<View style={[GlobalStyles.row, styles.filterBreadCrumContainer]}>
					<Text style={styles.filterBreadCrumText}>{breadCrum.filter.label}</Text>
					<Ionicons
						style={styles.filterBreadCrumText}
						name="md-close"
						size={20}
						color="black"
					/>
				</View>
			</TouchableBtn>
		);
	}

	render() {
		const { selectedScreen } = this.props;
		if (selectedScreen !== 'search') return null;
		return (
			<ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={[]}>
				<View style={[styles.container, GlobalStyles.row]}>
					{this.getSelectedFilters().map(this.renderFilterButton)}
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginLeft: 10,
		marginBottom: 15
	},
	filterBreadCrumContainer: {
		backgroundColor: Colors.primaryDarkColor,
		padding: 10,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginRight: 10,
		borderRadius: 20
	},
	filterBreadCrumText: {
		color: 'white',
		paddingLeft: 10,
		paddingRight: 5
	}
});

const ConnectedSelectedFilter = connect(
	(state: IRootState) => {
		return {
			filters: getSearchFilter(state),
			selectedScreen: getSelectedScreen(state)
		};
	},
	dispatch => {
		return {
			applyFilter: bindActionCreators(applyFilter, dispatch)
		};
	}
)(SelectedFilter);

export default ConnectedSelectedFilter;
