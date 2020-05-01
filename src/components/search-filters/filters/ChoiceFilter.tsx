import * as React from 'react';
import { FlatList, View } from 'react-native';

import Color from '../../../constants/Colors';
import CheckBox from 'react-native-check-box';

interface IChoiceFilterProps {
	choices: any;
	choicesValue: any;
	setChoiceValue: (key: string, value: boolean) => any;
}

interface IChoiceFilterState {
	filtersUpdated: number;
}

class ChoiceFilter extends React.PureComponent<IChoiceFilterProps, IChoiceFilterState> {
	constructor(props: IChoiceFilterProps) {
		super(props);
		this.state = {
			filtersUpdated: 0
		};
	}

	toggleOption(key: string) {
		const { setChoiceValue, choicesValue } = this.props;
		const value = choicesValue && choicesValue[key];
		if (key) {
			setChoiceValue(key, !value);
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps: IChoiceFilterProps) {
		if (this.props.choicesValue !== nextProps.choicesValue) {
			this.setState({
				filtersUpdated: this.state.filtersUpdated + 1
			});
		}
	}

	render() {
		const { choices, choicesValue } = this.props;
		if (!choices) return null;
		return (
			<View>
				<FlatList
					keyExtractor={(choice: any) => {
						const isChecked = choicesValue && choicesValue[choice.value];
						const keyName = (choice.label || '').toLowerCase().replace(/ /g, '-');
						return `${keyName}-${isChecked ? 'true' : 'false'}`;
					}}
					data={choices}
					renderItem={({ item }) => {
						const choice = item;
						const isChecked = choicesValue && choicesValue[choice.value];
						return (
							<View key={choice.label}>
								<CheckBox
									style={{ flex: 1, padding: 10 }}
									onClick={() => {
										this.toggleOption(choice.value);
									}}
									checkBoxColor={Color.primaryDarkColor}
									isChecked={isChecked}
									rightText={choice.label}
								/>
							</View>
						);
					}}
					extraData={this.state.filtersUpdated}
				/>
			</View>
		);
	}
}

export default ChoiceFilter;
