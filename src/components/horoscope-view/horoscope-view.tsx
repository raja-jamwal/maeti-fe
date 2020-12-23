import * as React from 'react';
import { View, StyleSheet } from 'react-native';
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

function PlanetHouse({
	style,
	children,
	number
}: { style?: any; children?: any; number?: number } = {}) {
	const planetStyle = [styles.planetHouse, style || {}];
	return (
		<View style={planetStyle}>
			{children}
			<Text
				style={{
					position: 'absolute',
					fontSize: 8,
					padding: 4,
					color: Colors.tintColor
				}}
			>
				{number}
			</Text>
		</View>
	);
}

function PlanetSpacer() {
	return <View style={styles.planetSpacer} />;
}

interface IHoroscopeViewProps {
	userProfileId: number;
	userProfile?: UserProfile;
	horoscope?: IHoroscope;
	horoscopeForm: Horoscope;
	fetchHoroscope: (userProfileId: number) => any;
	isCurrentUserProfile: boolean;
}

export function HoroscopeView({
	userProfileId,
	userProfile,
	horoscope,
	fetchHoroscope,
	isCurrentUserProfile
}: IHoroscopeViewProps) {
	if (!userProfile) return null;
	const [isLoading, setIsLoading] = React.useState(false);
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

	// order by planet house
	const planetLocation: any = {};
	Object.keys((horoscope && horoscope.planetLocation) || {}).forEach(planet => {
		const planetHouse = horoscope && horoscope.planetLocation[planet];
		const shortCode = planet.substring(0, 2);
		if (!!planetLocation[planetHouse]) {
			planetLocation[planetHouse].push(shortCode);
		} else {
			planetLocation[planetHouse] = [shortCode];
		}
	});

	const renderPlanet = (house: number) => {
		if (!planetLocation[house]) return null;
		return planetLocation[house].map((planet: string) => {
			return <Text style={styles.planetNumber}>{planet}</Text>;
		});
	};

	return (
		<View style={styles.container}>
			<Text style={[GlobalStyle.large, GlobalStyle.expand, styles.title]}>Kundali</Text>
			{!!isBirthDataAvailable && isCurrentUserProfile && (
				<Value>Add your birth place and time to see your kundali</Value>
			)}
			<View>
				<View style={styles.row}>
					<PlanetHouse number={8} style={{ ...styles.planetBoxSize }}>
						{renderPlanet(8)}
					</PlanetHouse>
					<PlanetHouse
						number={9}
						style={{ ...GlobalStyle.expand, ...styles.planetHouseBottomBorder }}
					>
						{renderPlanet(9)}
					</PlanetHouse>
					<PlanetHouse
						number={10}
						style={{ ...GlobalStyle.expand, ...styles.planetHouseBottomBorder }}
					>
						{renderPlanet(10)}
					</PlanetHouse>
					<PlanetHouse
						number={11}
						style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
					>
						{renderPlanet(11)}
					</PlanetHouse>
				</View>
				<View style={[styles.row, styles.expand]}>
					<View style={{ width: 100 }}>
						<PlanetHouse
							number={7}
							style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
						>
							{renderPlanet(7)}
						</PlanetHouse>
						<PlanetHouse
							number={6}
							style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
						>
							{renderPlanet(6)}
						</PlanetHouse>
					</View>
					<PlanetSpacer />
					<View style={{ width: 100 }}>
						<PlanetHouse
							number={12}
							style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
						>
							{renderPlanet(12)}
						</PlanetHouse>
						<PlanetHouse
							number={1}
							style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
						>
							{renderPlanet(1)}
						</PlanetHouse>
					</View>
				</View>
				<View style={styles.row}>
					<PlanetHouse
						number={5}
						style={{ ...styles.planetBoxSize, ...styles.planetHouseBottomBorder }}
					>
						{renderPlanet(5)}
					</PlanetHouse>
					<PlanetHouse
						number={4}
						style={{ ...GlobalStyle.expand, ...styles.planetHouseBottomBorder }}
					>
						{renderPlanet(4)}
					</PlanetHouse>
					<PlanetHouse
						number={3}
						style={{ ...GlobalStyle.expand, ...styles.planetHouseBottomBorder }}
					>
						{renderPlanet(3)}
					</PlanetHouse>
					<PlanetHouse
						number={2}
						style={{
							...styles.planetBoxSize,
							...styles.planetHouseBottomBorder,
							...styles.planetHouseRightBorder
						}}
					>
						{renderPlanet(2)}
					</PlanetHouse>
				</View>
			</View>
		</View>
	);
}

const mapStateToProps = (state: IRootState, props: IHoroscopeViewProps) => {
	const userProfile = getUserProfileForId(state, props.userProfileId);
	const currentUserProfileId = getCurrentUserProfileId(state);
	const isCurrentUserProfile = userProfile.id === currentUserProfileId;
	return {
		userProfile,
		horoscope: getHoroscopeForProfileId(state, props.userProfileId),
		isCurrentUserProfile
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
	title: {
		paddingBottom: 10,
		color: Colors.primaryDarkColor,
		fontWeight: '500'
	},
	planetNumber: {
		margin: 10,
		color: Colors.tintColor,
		fontWeight: '600'
	},
	planetHouse: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		borderColor: Colors.tintColor,
		borderWidth: 1,
		borderRightWidth: 0,
		borderBottomWidth: 0
	},
	planetBoxSize: {
		width: 100,
		height: 80
	},
	planetHouseRightBorder: {
		borderRightWidth: 1
	},
	planetHouseBottomBorder: {
		borderBottomWidth: 1
	},
	planetSpacer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center'
	}
});
