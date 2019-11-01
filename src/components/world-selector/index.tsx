import * as React from 'react';
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	TouchableNativeFeedback,
	Modal,
	TextInput
} from 'react-native';
import { ApiRequest } from '../../utils';
import { API } from '../../config/API';
import { getLogger } from '../../utils/logger';
import { Throbber } from '../throbber/throbber';
import { City, Country, Region, WorldEntity } from '../../store/reducers/account-defination';
import { includes } from 'lodash';
import Color from '../../constants/Colors';

export enum WORLD_OPTION {
	COUNTRY = 'country',
	STATE = 'state',
	CITY = 'city'
}

export interface SelectionResult {
	country?: Country;
	state?: Region;
	city?: City;
}

interface IWorldSelectorProps {
	options: WORLD_OPTION[];
	onSelect: (selection: SelectionResult) => void;
}

interface IWorldSelectorState {
	loading: boolean;
	countries: Country[];
	regions: Region[];
	cities: City[];
	selection: SelectionResult;
	screen: WORLD_OPTION;
	filterText: string;
}

function Item({ id, name, onSelect }) {
	return (
		<TouchableNativeFeedback onPress={() => onSelect({ id, name })}>
			<View style={styles.item}>
				<Text>{name}</Text>
			</View>
		</TouchableNativeFeedback>
	);
}

class WorldSelector extends React.Component<IWorldSelectorProps, IWorldSelectorState> {
	logger = getLogger(WorldSelector);

	constructor(props: IWorldSelectorProps) {
		super(props);
		this.state = {
			loading: false,
			countries: [],
			regions: [],
			cities: [],
			selection: {},
			screen: WORLD_OPTION.COUNTRY,
			filterText: ''
		};
	}

	componentDidMount() {
		this.mayBeFetchCountryList();
	}

	mayBeFetchCountryList() {
		this.setState({
			loading: true
		});
		ApiRequest(API.WORLD.COUNTRY, {})
			.then((countries: any) => {
				this.logger.log(`countries.length ${countries.length}`);
				this.setState({
					countries: countries as Country[],
					loading: false
				});
			})
			.catch(err => {
				this.setState({ loading: false });
			});
	}

	mayBeFetchRegions(countryId: number) {
		this.setState({
			loading: true
		});
		ApiRequest(API.WORLD.STATES, { countryId })
			.then(regions => {
				this.setState({
					regions: regions as Region[],
					loading: false
				});
			})
			.catch(err => {
				this.setState({ loading: false });
			});
	}

	mayBeFetchCities(regionId: number) {
		this.setState({
			loading: true
		});
		ApiRequest(API.WORLD.CITIES, { regionId })
			.then(cities => {
				this.setState({
					cities: cities as City[],
					loading: false
				});
			})
			.catch(err => {
				this.setState({ loading: false });
			});
	}

	onSelect(entity: WORLD_OPTION, data: any) {
		const { options, onSelect } = this.props;
		const { selection } = this.state;
		const newSelection = Object.assign({}, selection, { [entity]: data });
		let nextScreen = null;
		switch (entity) {
			case WORLD_OPTION.COUNTRY:
				this.mayBeFetchRegions(data.id);
				nextScreen = WORLD_OPTION.STATE;
				break;
			case WORLD_OPTION.STATE:
				this.mayBeFetchCities(data.id);
				nextScreen = WORLD_OPTION.CITY;
				break;
		}
		const isValidScreen = !!nextScreen && includes(options, nextScreen);
		if (!isValidScreen) {
			// return;
			return onSelect(newSelection);
		}
		this.setState({
			selection: newSelection,
			screen: nextScreen as WORLD_OPTION,
			filterText: ''
		});
	}

	maybeFilter(entities: WorldEntity[], filterText: string) {
		if (!entities || !filterText) return entities;
		return entities.filter(entity =>
			(entity.name || '').toLowerCase().includes(filterText.toLowerCase())
		);
	}

	getData() {
		const { countries, regions, cities, screen, filterText } = this.state;
		switch (screen) {
			case WORLD_OPTION.COUNTRY:
				return this.maybeFilter(countries, filterText);
			case WORLD_OPTION.STATE:
				return this.maybeFilter(regions, filterText);
			case WORLD_OPTION.CITY:
				return this.maybeFilter(cities, filterText);
			default:
				return [];
		}
	}

	renderList(type: any, data: any) {
		return (
			<FlatList
				data={data}
				renderItem={({ item }: any) => (
					<Item
						id={item.id}
						name={item.name}
						onSelect={(data: any) => this.onSelect(type, data)}
					/>
				)}
				keyExtractor={item => `${item.id}`}
			/>
		);
	}

	render() {
		const { screen, loading, filterText } = this.state;
		const data = this.getData();
		return (
			<View>
				<Text style={styles.title}>Select {screen}</Text>
				{!loading && (
					<View style={styles.textField}>
						<TextInput
							onChangeText={text => this.setState({ filterText: text })}
							value={filterText}
							style={styles.fieldText}
						/>
					</View>
				)}
				{!!loading && <Throbber size="large" />}
				{!loading && this.renderList(screen, data)}
			</View>
		);
	}
}

interface IWorldSelectorFieldProps {
	options: WORLD_OPTION[];
	onSelect: (selection: SelectionResult) => void;
	value: string;
}

interface IWorldSelectorFieldState {
	showModal?: boolean;
}

class WorldSelectorField extends React.Component<
	IWorldSelectorFieldProps,
	IWorldSelectorFieldState
> {
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
		const { options, onSelect, value } = this.props;
		return (
			<View>
				<TouchableNativeFeedback onPress={() => this.toggleShowModal()}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>{value || ' '}</Text>
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
						<WorldSelector
							options={options}
							onSelect={selection => {
								onSelect(selection);
								this.toggleShowModal();
							}}
						/>
					</View>
				</Modal>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		// flex: 1,
		// backgroundColor: Color.white
	},
	textField: {
		borderColor: Color.borderColor,
		borderWidth: 1,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 6,
		paddingBottom: 6,
		borderRadius: 4,
		marginLeft: 12,
		marginRight: 12
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

export { WorldSelectorField };
