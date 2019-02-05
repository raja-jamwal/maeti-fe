import React from 'react';
import { StyleSheet } from 'react-native';
import Text, { Value } from '../text';
export default class Divider extends React.Component {
	render() {
		return <Value style={styles.divider}>|</Value>;
	}
}

const styles = StyleSheet.create({
	divider: {
		fontSize: 12
	}
});
