import * as React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Text, { Value } from '../text';
import Colors from 'src/constants/Colors.js';
import GlobalStyle from 'src/styles/global';
import { connect } from 'react-redux';
import { IRootState } from '../../store/index';
import { Dispatch, bindActionCreators } from 'redux';
import { UserProfile, Horoscope } from '../../store/reducers/account-defination';
import { getUserProfileForId } from '../../store/reducers/user-profile-reducer';
import {
	fetchHoroscope,
	getHoroscopeForProfileId,
	IHoroscope
} from '../../store/reducers/horoscope-reducer';
import { Throbber } from '../throbber/throbber';
import { getCurrentUserProfileId } from '../../store/reducers/account-reducer';
import { isObject } from 'lodash';
import Collapsible from 'react-native-collapsible';
import TouchableBtn from '../touchable-btn/touchable-btn';
import { Ionicons } from '@expo/vector-icons';
import Layout from 'src/constants/Layout.js';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const kundaliImage = require('../../assets/images/kundali.png');
interface IHoroscopeViewProps {
	userProfileId: number;
	userProfile?: UserProfile;
	horoscope?: IHoroscope;
	horoscopeForm: Horoscope;
	fetchHoroscope: (userProfileId: number) => any;
	isCurrentUserProfile: boolean;
	isAdmin: boolean;
}

const planetsInHindi: any = {
	Sun: 'सूर्य',
	Moon: 'चंद्र',
	Mars: 'मंगल',
	Mercury: 'बुध',
	Jupiter: 'बृहस्पति',
	Venus: 'शुक्र',
	Saturn: 'शनि',
	Rahu: 'राहु',
	Ketu: 'केतु',
	Ascendant: ' ',
	'Ra/Ke': 'Ra/Ke'
};

// @ts-ignore
function KundaliHouse({ houseValue, housePosition, left, top }) {
	const translatedNames = houseValue.map(value => planetsInHindi[value] || value);
	return (
		<View
			style={[
				GlobalStyle.column,
				GlobalStyle.alignCenter,
				{ position: 'absolute', left: left, top: top }
			]}
		>
			{translatedNames.map(value => (
				<Value
					style={{
						color: Colors.tintColor,
						fontWeight: 'bold'
					}}
				>
					{value}
				</Value>
			))}
			<Value
				style={{
					color: Colors.tintColor,
					margin: 4,
					fontSize: 10
				}}
			>
				{housePosition}
			</Value>
		</View>
	);
}

function rasiChartToKundaliViewPos(chart: any) {
	const result: any = {};
	// find the asc position, lets say it is 5
	const ascPos = chart['Ascendant'];
	// no asc no chart
	if (!ascPos) return result;
	Object.keys(chart).forEach(planet => {
		const pos = chart[planet];
		const adjusted = pos - ascPos;
		if (adjusted >= 0) {
			result[planet] = adjusted;
		} else {
			result[planet] = 12 + adjusted;
		}
	});

	return result;
}

function groupKeysByValue(chart: any) {
	const result: any = {};
	Object.keys(chart).forEach(key => {
		const value = chart[key];
		if (!!result[value]) {
			result[value].push(key);
		} else {
			result[value] = [key];
		}
	});
	return result;
}

function getPlanetLocationForHouseNumber(kundaliViewPositions: any, houseNumber: number) {
	const grouped = groupKeysByValue(kundaliViewPositions);
	return grouped[houseNumber] || [];
}

// @ts-ignore
function KundaliView({ chartName, chartData } = { chartName: '', chartData: {} }) {
	const containerDim = {
		width: Layout.window.width - 20,
		height: Layout.window.width
	};
	const ascPos = chartData && chartData['Ascendant'];
	// no asc no chart
	if (!ascPos) return null;

	const planetLocations = rasiChartToKundaliViewPos(chartData);

	const getRasiPositionInHouse = ascSumHousePosition => {
		const mod = ascSumHousePosition % 12;
		return mod === 0 ? 12 : mod;
	};

	return (
		<View>
			<View>
				<Image
					source={kundaliImage}
					style={[
						{
							width: containerDim.width,
							height: containerDim.height,
							resizeMode: 'stretch'
						}
					]}
				/>
				<View style={{ position: 'absolute' }}>
					<View
						style={{
							position: 'relative',
							left: 0,
							top: 0,
							width: containerDim.width,
							height: containerDim.height
						}}
					>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 0)}
							housePosition={getRasiPositionInHouse(ascPos)}
							left="47%"
							top="10%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 1)}
							housePosition={getRasiPositionInHouse(ascPos + 1)}
							left="22%"
							top="4%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 2)}
							housePosition={getRasiPositionInHouse(ascPos + 2)}
							left="2%"
							top="10%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 3)}
							housePosition={getRasiPositionInHouse(ascPos + 3)}
							left="22%"
							top="35%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 4)}
							housePosition={getRasiPositionInHouse(ascPos + 4)}
							left="2%"
							top="65%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 5)}
							housePosition={getRasiPositionInHouse(ascPos + 5)}
							left="22%"
							top="80%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 6)}
							housePosition={getRasiPositionInHouse(ascPos + 6)}
							left="47%"
							top="65%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 7)}
							housePosition={getRasiPositionInHouse(ascPos + 7)}
							left="72%"
							top="80%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 8)}
							housePosition={getRasiPositionInHouse(ascPos + 8)}
							left="90%"
							top="65%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 9)}
							housePosition={getRasiPositionInHouse(ascPos + 9)}
							left="72%"
							top="35%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 10)}
							housePosition={getRasiPositionInHouse(ascPos + 10)}
							left="90%"
							top="12%"
						/>
						<KundaliHouse
							houseValue={getPlanetLocationForHouseNumber(planetLocations, 11)}
							housePosition={getRasiPositionInHouse(ascPos + 11)}
							left="72%"
							top="4%"
						/>
						<Value
							style={{
								position: 'absolute',
								left: 5,
								bottom: 5,
								color: Colors.tintColor,
								fontWeight: 'bold',
								textTransform: 'capitalize'
							}}
						>
							{chartName} Chart
						</Value>
						<Value
							style={{
								position: 'absolute',
								right: 5,
								bottom: 5,
								color: Colors.tintColor,
								fontWeight: 'bold'
							}}
						>
							Generated by Maeti App © DataGrids™
						</Value>
					</View>
				</View>
			</View>
		</View>
	);
}

export function HoroscopeView({
	userProfileId,
	userProfile,
	horoscope,
	fetchHoroscope,
	isCurrentUserProfile,
	isAdmin
}: IHoroscopeViewProps) {
	if (!userProfile) return null;
	if (!isAdmin) return null;
	const [isLoading, setIsLoading] = React.useState(false);
	const [isExpanded, setIsExpanded] = React.useState(true);
	const [chartIndex, setChartIndex] = React.useState(0);
	React.useEffect(() => {
		(async () => {
			setIsLoading(true);
			await fetchHoroscope(userProfileId);
			setIsLoading(false);
		})();
	}, [userProfile]);

	if (isLoading) {
		return <Throbber size="small" />;
	}

	const isBirthDataAvailable =
		userProfile.horoscope.birthPlace && userProfile.horoscope.birthTime;

	const renderHoroscope = (horoscope: any) => {
		return (
			<View style={styles.horoscopeData}>
				{Object.keys(horoscope).map((key, i) => {
					const value = horoscope[key];
					if (isObject(value)) return null;
					return (
						<View style={GlobalStyle.row} key={i}>
							<Value style={styles.tableKey}>{key}</Value>
							<Value>:</Value>
							<Value style={styles.tableValue}>{value}</Value>
						</View>
					);
				})}
			</View>
		);
	};

	const caretIconName = isExpanded ? 'chevron-up' : 'chevron-down';
	const toggleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const chartTypes = ['rasi', 'navamsa'];
	if (!horoscope) return null;
	return (
		<View style={styles.container}>
			<View style={[GlobalStyle.row, GlobalStyle.expand]}>
				<TouchableBtn style={GlobalStyle.expand} onPress={toggleExpand}>
					<View style={[GlobalStyle.row, GlobalStyle.alignCenter, GlobalStyle.expand]}>
						<Text style={[GlobalStyle.large, GlobalStyle.expand, styles.title]}>
							Kundali
						</Text>
						<Ionicons
							style={styles.headerIcon}
							color={Colors.primaryDarkColor}
							name={caretIconName}
							size={20}
						/>
					</View>
				</TouchableBtn>
			</View>
			<Collapsible collapsed={!isExpanded}>
				{!!isBirthDataAvailable && isCurrentUserProfile && (
					<Value>Add your birth place and time to see your kundali</Value>
				)}
				<View>
					<Carousel
						data={chartTypes}
						renderItem={({ item: chartName }) => {
							const chartData = horoscope[chartName];
							if (!chartData) return null;
							return <KundaliView chartData={chartData} chartName={chartName} />;
						}}
						itemWidth={Layout.window.width}
						sliderWidth={Layout.window.width}
						onSnapToItem={index => setChartIndex(index)}
					/>
					<Pagination
						dotsLength={chartTypes.length}
						activeDotIndex={chartIndex}
						dotStyle={{
							width: 5,
							height: 5,
							borderRadius: 5,
							backgroundColor: Colors.tintColor
						}}
						inactiveDotOpacity={0.4}
						inactiveDotScale={0.6}
					/>
				</View>
				{!!horoscope && !!horoscope.horoscope && renderHoroscope(horoscope.horoscope)}
			</Collapsible>
		</View>
	);
}

const mapStateToProps = (state: IRootState, props: IHoroscopeViewProps) => {
	const userProfile = getUserProfileForId(state, props.userProfileId);
	const currentUserProfileId = getCurrentUserProfileId(state);
	const currentUserProfile = getUserProfileForId(state, currentUserProfileId);
	const isCurrentUserProfile = userProfile.id === currentUserProfileId;
	const isAdmin = currentUserProfile.fullName === 'Zorawar Relwani';
	return {
		userProfile,
		horoscope: getHoroscopeForProfileId(state, props.userProfileId),
		isCurrentUserProfile,
		isAdmin
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		fetchHoroscope: bindActionCreators(fetchHoroscope, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(HoroscopeView);

const styles = StyleSheet.create({
	container: {
		margin: 8
	},
	row: {
		flexDirection: 'row'
	},
	expand: {
		flex: 1
	},
	horoscopeData: {
		marginTop: 8
	},
	tableKey: {
		flex: 0.5,
		textTransform: 'capitalize'
	},
	tableValue: {
		flex: 0.5,
		textTransform: 'capitalize',
		fontWeight: '500',
		color: Colors.black
	},
	title: {
		paddingBottom: 10,
		color: Colors.primaryDarkColor,
		fontWeight: '500'
	}
});
