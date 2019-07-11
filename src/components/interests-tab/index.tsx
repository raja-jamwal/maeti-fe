import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Colors from '../../constants/Colors';
import IncomingTab from './tabs/IncomingTab';
import AcceptedTab from './tabs/AcceptedTab';
import SentTab from './tabs/SentTab';

export default class InterestsTab extends React.Component {
	state = {
		index: 0,
		routes: [
			{ key: 'incoming', title: 'Incoming' },
			{ key: 'accepted', title: 'Accepted' },
			{ key: 'sent', title: 'Sent' }
		]
	};

	constructor(props: any) {
		super(props);
		this.onIndexChange = this.onIndexChange.bind(this);
	}

	_renderHeader = props => {
		return (
			<View>
				<TabBar style={styles.tabbar} {...props} />
			</View>
		);
	};

	onIndexChange(index: number) {
		console.log('shoud set index ', index);
		this.setState({ index });
	}

	render() {
		return (
			<TabView
				navigationState={this.state}
				renderScene={SceneMap({
					incoming: IncomingTab,
					accepted: AcceptedTab,
					sent: SentTab
				})}
				renderTabBar={this._renderHeader}
				onIndexChange={this.onIndexChange}
				initialLayout={{
					width: Dimensions.get('window').width,
					height: Dimensions.get('window').height
				}}
				lazy={true}
			/>
		);
	}
}

const styles = StyleSheet.create({
	scene: {
		flex: 1
	},
	tabbar: {
		backgroundColor: Colors.primaryDarkColor
	},
	profileCardContainer: {
		elevation: 10,
		marginBottom: 10,
		borderColor: 'black'
	}
});
