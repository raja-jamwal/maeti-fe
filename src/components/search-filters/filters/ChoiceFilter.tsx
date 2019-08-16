import * as React from 'react';
import { FlatList, View } from 'react-native';

import Color from '../../../constants/Colors';
import CheckBox from 'react-native-check-box';

interface IChoiceFilterProps {
	choices: any;
	choicesValue: any;
	setChoiceValue: (key: string, value: boolean) => any;
}

class ChoiceFilter extends React.PureComponent<IChoiceFilterProps> {
	toggleOption(key: string) {
		const { setChoiceValue, choicesValue } = this.props;
		const value = choicesValue && choicesValue[key];
		if (key) {
			setChoiceValue(key, !value);
		}
	}

	render() {
		const { choices, choicesValue } = this.props;
		if (!choices) return null;
		return (
			<View>
				<FlatList
					keyExtractor={(choice: any) => choice.value}
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
				/>
			</View>
		);
	}
}

export default ChoiceFilter;
