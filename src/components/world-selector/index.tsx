import * as React from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TextInput, SafeAreaView } from 'react-native';
import { ApiRequest } from '../../utils';
import { API } from '../../config/API';
import { getLogger } from '../../utils/logger';
import { Throbber } from '../throbber/throbber';
import { City, Country, Region, WorldEntity } from '../../store/reducers/account-defination';
import { includes, head } from 'lodash';
import Color from '../../constants/Colors';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import EditProfileScreen from '../../screens/EditProfileScreen';

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
	toggleShowModal: () => any;
	countryId?: number;
	stateId?: number;
	setState?: boolean;
	setCountry?: boolean;
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
		<TouchableBtn onPress={() => onSelect({ id, name })}>
			<View style={styles.item}>
				<Text>{name}</Text>
			</View>
		</TouchableBtn>
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
			screen: head(this.props.options),
			filterText: ''
		};
	}

	componentDidMount() {
		if (this.props.stateId) {
			return this.mayBeFetchCities(this.props.stateId);
		} else if (this.props.countryId) {
			return this.mayBeFetchRegions(this.props.countryId);
		} else {
			return this.mayBeFetchCountryList();
		}
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

		const selectedScreen = head(this.props.options);
		if (!selectedScreen) return [];
		if (selectedScreen === 'city') {
			return this.maybeFilter(cities, filterText);
		} else if (selectedScreen === 'country') {
			return this.maybeFilter(countries, filterText);
		} else {
			return this.maybeFilter(regions, filterText);
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
		const { toggleShowModal } = this.props;
		const data = this.getData();
		return (
			<SafeAreaView>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						marginRight: 16
					}}
				>
					{/*<Text style={styles.title}>{title || 'No Title'}</Text>*/}
					<Text style={styles.title}>Select {screen}</Text>
					<View style={{ flex: 1 }} />
					<TouchableBtn onPress={() => toggleShowModal()}>
						<Ionicons name="md-close" size={26} color={Color.offWhite} />
					</TouchableBtn>
				</View>
				{!loading && (
					<View style={styles.textField}>
						<TextInput
							onChangeText={text => this.setState({ filterText: text })}
							value={filterText}
							// style={styles.fieldText}
						/>
					</View>
				)}
				{!!loading && <Throbber size="large" />}
				{!loading && this.renderList(screen, data)}
			</SafeAreaView>
		);
	}
}

interface IWorldSelectorFieldProps {
	options: WORLD_OPTION[];
	onSelect: (selection: SelectionResult) => void;
	value: string;
	stateId?: number;
	countryId?: number;
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
		const { options, onSelect, value, countryId, stateId, setState, setCountry } = this.props;
		return (
			<View>
				<TouchableBtn onPress={() => this.toggleShowModal()}>
					<View style={styles.labelContainer}>
						<Text style={styles.label}>{value || ' '}</Text>
					</View>
				</TouchableBtn>
				<Modal
					animationType="slide"
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
							toggleShowModal={() => this.toggleShowModal()}
							countryId={this.props.countryId}
							stateId={this.props.stateId}
							setState={this.props.setState}
							setCountry={this.props.setCountry}
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
