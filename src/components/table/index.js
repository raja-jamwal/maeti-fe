import React from 'react';
import * as _ from 'lodash';
import Text, { Value } from '../text/index';
import { View, StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/global';
import { map, includes, find } from 'lodash';
import { formatDate, formatDateTime } from '../../utils';
import Colors from 'src/constants/Colors';

export default class Table extends React.Component {
	renderValue(value, mapping) {
		const { isAccountPaid } = this.props;
		if (mapping.type) {
			if (!!mapping.isPaidFeature && !isAccountPaid) {
				return 'Visible to paid users';
			}
			if (mapping.type === 'about') {
				return value || '';
			}

			if (mapping.type === 'date') {
				if (!value) return '';
				return formatDate(value);
			}

			if (mapping.type === 'date-time') {
				if (!value) return '';
				return formatDateTime(value);
			}

			if (mapping.type === 'tag-array') {
				return map(value, 'value').join(', ');
			}

			if (mapping.type === 'choice') {
				const options = (mapping.choice && mapping.choice.options) || [];
				const option = find(options, { value });
				return !!option ? option.label || value : '';
			}

			if (includes(['country', 'state', 'city'], mapping.type)) {
				return value && value.name;
			}
		}

		// Phase out dynamic type check

		if (_.isString(value) || _.isNumber(value)) {
			if (value === '0' || value === 0) return null;
			return value;
		}
		if (_.isBoolean(value)) {
			return value ? 'Yes' : 'No';
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
										<Value style={[styles.tableValue, styles.aboutValue]}>
											{this.renderValue(object[key], mappings[key])}
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
		fontWeight: '500',
		color: Colors.black
	},
	aboutValue: {
		paddingTop: 5,
		paddingBottom: 5
	}
});
