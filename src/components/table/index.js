import React from 'react';
import * as _ from 'lodash';
import Text, { Value } from '../text/index';
import { View, StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/global';
import { map, includes } from 'lodash';

export default class Table extends React.Component {
	renderValue(value, mapping) {
		if (_.isString(value) || _.isNumber(value)) {
			return value;
		}
		if (_.isBoolean(value)) {
			return value ? 'Yes' : 'No';
		}

		if (mapping.type === 'tag-array') {
			return map(value, 'value').join(', ');
		}

		if (includes(['country', 'state', 'city'], mapping.type)) {
			return value && value.name;
		}

		return null;
	}

	renderKey(key, mapping) {
		if (mapping) {
			return <Value style={styles.tableKey}>{mapping.label}</Value>;
		}
		return <Value style={styles.tableKey}>{key}</Value>;
	}
	render() {
		const { object, mapping } = this.props;
		const mappings = mapping || {};
		let keys = _.sortBy(_.filter(_.keys(object), k => mappings[k]), [
			key => !(mappings[key].type === 'about')
		]);
		return (
			<View>
				{keys &&
					keys.map(key => {
						const keyType = mappings[key] && mappings[key].type;
						if (keyType === 'about') {
							return (
								<View key={key}>
									<View style={GlobalStyles.row} key={key}>
										<Value>{this.renderKey(key, mappings[key])}</Value>
										<Value>:</Value>
									</View>
									<View>
										<Value style={styles.tableValue}>
											{this.renderValue(object[key])}
										</Value>
									</View>
								</View>
							);
						}
						return (
							<View style={GlobalStyles.row} key={key}>
								<Value style={styles.tableKey}>
									{this.renderKey(key, mappings[key])}
								</Value>
								<Value>:</Value>
								<Value style={styles.tableValue}>
									{this.renderValue(object[key], mappings[key])}
								</Value>
							</View>
						);
					})}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	tableKey: {
		flex: 0.5,
		textTransform: 'capitalize'
	},
	tableValue: {
		flex: 0.5,
		textTransform: 'capitalize',
		fontWeight: '500'
	}
});
