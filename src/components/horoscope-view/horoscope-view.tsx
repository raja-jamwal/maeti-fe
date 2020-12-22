import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import Text, { Value } from '../text';
import Colors from 'src/constants/Colors.js';
import GlobalStyle from 'src/styles/global';

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
	return (
		<View style={styles.planetSpacer}>
			<Value>Rashi</Value>
		</View>
	);
}

export function HoroscopeView() {
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<PlanetHouse number={8} style={{ ...styles.planetBoxSize }}>
					<Text style={styles.planetNumber}>Sa</Text>
					<Text style={styles.planetNumber}>Sa</Text>
				</PlanetHouse>
				<PlanetHouse
					number={9}
					style={{ ...GlobalStyle.expand, ...styles.planetHouseBottomBorder }}
				/>
				<PlanetHouse
					number={10}
					style={{ ...GlobalStyle.expand, ...styles.planetHouseBottomBorder }}
				/>
				<PlanetHouse
					number={11}
					style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
				/>
			</View>
			<View style={[styles.row, styles.expand]}>
				<View style={{ width: 100 }}>
					<PlanetHouse
						number={7}
						style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
					/>
					<PlanetHouse
						number={6}
						style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
					/>
				</View>
				<PlanetSpacer />
				<View style={{ width: 100 }}>
					<PlanetHouse
						number={12}
						style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
					/>
					<PlanetHouse
						number={1}
						style={{ ...styles.planetBoxSize, ...styles.planetHouseRightBorder }}
					/>
				</View>
			</View>
			<View style={styles.row}>
				<PlanetHouse
					number={5}
					style={{ ...styles.planetBoxSize, ...styles.planetHouseBottomBorder }}
				/>
				<PlanetHouse
					number={4}
					style={{ ...GlobalStyle.expand, ...styles.planetHouseBottomBorder }}
				/>
				<PlanetHouse
					number={3}
					style={{ ...GlobalStyle.expand, ...styles.planetHouseBottomBorder }}
				/>
				<PlanetHouse
					number={2}
					style={{
						...styles.planetBoxSize,
						...styles.planetHouseBottomBorder,
						...styles.planetHouseRightBorder
					}}
				>
					<Text style={styles.planetNumber}>Sa</Text>
					<Text style={styles.planetNumber}>Su</Text>
					<Text style={styles.planetNumber}>Ma</Text>
					<Text style={styles.planetNumber}>Ma</Text>
				</PlanetHouse>
			</View>
		</View>
	);
}

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
