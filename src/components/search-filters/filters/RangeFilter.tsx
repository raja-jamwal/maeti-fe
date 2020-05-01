import * as React from 'react';
import { Text, View, StyleSheet, Slider } from 'react-native';
import Colors from 'src/constants/Colors';
import { isEqual } from 'lodash';
import { humanizeCurrency } from '../../../utils';

export interface IRangeFilterProps {
	from: number;
	to: number;
	defaultFrom: number;
	defaultTo: number;
	rangeValue?: any;
	suffix?: string;
	prefix?: string;
	setRangeValue?: (range: any) => void;
}

interface ISliderRanges {
	first: {
		from: number;
		to: number;
		default: number;
	};
	second: {
		from: number;
		to: number;
		default: number;
	};
}

interface IRangeFilterState {
	selectedFrom: number;
	selectedTo: number;
}

enum SLIDERS {
	FIRST,
	SECOND
}

export default class RangeFilter extends React.Component<IRangeFilterProps, IRangeFilterState> {
	constructor(props: IRangeFilterProps) {
		super(props);
		this.state = {
			selectedFrom: 0,
			selectedTo: 0
		};
	}

	componentDidMount(): void {
		const ranges = RangeFilter.getRanges(this.props);
		const { from, to } = this.props.rangeValue || {};
		this.setState({
			selectedFrom: from || ranges.first.default,
			selectedTo: to || ranges.second.default
		});
	}

	getFormattedValue(value: number) {
		const prefix = this.props.prefix || '';
		const suffix = this.props.suffix || '';
		const humanized = humanizeCurrency(value, prefix);
		return `${humanized} ${suffix}`;
	}

	static getRanges(props: IRangeFilterProps): ISliderRanges {
		const { from, to, defaultFrom, defaultTo } = props;
		const middleNumber = to / 2;
		const firstBoundary = Math.floor(middleNumber);
		const secondBoundary = Math.ceil(middleNumber);
		return {
			first: {
				from: from,
				to: firstBoundary,
				default: defaultFrom
			},
			second: {
				from: secondBoundary,
				to: to,
				default: defaultTo
			}
		};
	}

	UNSAFE_componentWillReceiveProps(nextProps: Readonly<IRangeFilterProps>): void {
		const ranges = RangeFilter.getRanges(nextProps);
		const isRangeValueSupplied =
			nextProps.rangeValue && nextProps.rangeValue.from && nextProps.rangeValue.to;
		if (!isRangeValueSupplied) {
			this.setState({
				selectedFrom: ranges.first.default,
				selectedTo: ranges.second.default
			});
		} else if (!isEqual(nextProps.rangeValue, this.props.rangeValue)) {
			const { from, to } = nextProps.rangeValue;
			this.setState({
				selectedTo: to,
				selectedFrom: from
			});
		}
	}

	toSliderValue(slider: SLIDERS, value: number) {
		const ranges = RangeFilter.getRanges(this.props);
		if (slider === SLIDERS.FIRST) {
			return -(value - ranges.first.to - ranges.first.from);
		}
		return value;
	}

	fromSliderValue(slider: SLIDERS, value: number) {
		const ranges = RangeFilter.getRanges(this.props);
		if (slider === SLIDERS.FIRST) {
			return ranges.first.to - (value - ranges.first.from);
		}
		return value;
	}

	render() {
		const ranges = RangeFilter.getRanges(this.props);
		const { selectedTo, selectedFrom } = this.state;
		return (
			<View style={styles.container}>
				<Text style={styles.sliderLabels}>
					From: {this.getFormattedValue(selectedFrom)}
				</Text>
				<Slider
					style={styles.startSlider}
					onValueChange={() => null}
					onSlidingComplete={this.handleEndValue(SLIDERS.FIRST).bind(this)}
					value={this.fromSliderValue(SLIDERS.FIRST, selectedFrom)}
					step={1}
					minimumValue={ranges.first.from}
					maximumValue={ranges.first.to}
					thumbTintColor={Colors.primaryDarkColor}
					minimumTrackTintColor={Colors.primaryDarkColor}
				/>
				<Text style={styles.sliderLabels}>To: {this.getFormattedValue(selectedTo)}</Text>
				<Slider
					onValueChange={() => null}
					onSlidingComplete={this.handleEndValue(SLIDERS.SECOND).bind(this)}
					value={this.fromSliderValue(SLIDERS.SECOND, selectedTo)}
					step={1}
					minimumValue={ranges.second.from}
					maximumValue={ranges.second.to}
					thumbTintColor={Colors.primaryDarkColor}
					minimumTrackTintColor={Colors.primaryDarkColor}
				/>
			</View>
		);
	}

	handleEndValue = (slideType: SLIDERS) => {
		const ranges = RangeFilter.getRanges(this.props);
		return (value: number) => {
			/**
			 * This should ensure the filter ranges are properly set
			 * when either of the sliders are touched
			 */
			const selectedFrom = this.state.selectedFrom || ranges.first.default;
			const selectedTo = this.state.selectedTo || ranges.second.default;
			const result = this.toSliderValue(slideType, value);

			const rangeValue = {
				from: slideType === SLIDERS.FIRST ? result : selectedFrom,
				to: slideType === SLIDERS.SECOND ? result : selectedTo
			};

			this.props.setRangeValue && this.props.setRangeValue(rangeValue);
		};
	};
}

const styles = StyleSheet.create({
	container: {
		padding: 10
	},
	sliderLabels: {
		fontSize: 15,
		marginBottom: 8
	},
	startSlider: {
		width: '100%',
		transform: [{ rotateY: '180deg' }]
	}
});
