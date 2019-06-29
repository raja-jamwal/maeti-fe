import * as React from 'react';
import { FlatList, StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { Throbber } from '../throbber/throbber';
import ConnectedProfileCard from '../profile-card/connected-profile';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';

interface IVirtualProfileListProps {
	fetching?: boolean;
	profileIdExtractor: (item: any) => number;
	data: Array<any>;
	headerComponent: any;
	handleMore: () => any;
}

interface IVirtualProfileListState {
	isFetchingMore: boolean;
}

class VirtualProfileList extends React.Component<
	NavigationInjectedProps & IVirtualProfileListProps,
	IVirtualProfileListState
> {
	constructor(props: any) {
		super(props);
		this.state = {
			isFetchingMore: false
		};
		this.openProfileScreen = this.openProfileScreen.bind(this);
		this._handleMore = this._handleMore.bind(this);
		this.renderProfileCard = this.renderProfileCard.bind(this);
	}

	componentWillReceiveProps(nextProps: IVirtualProfileListProps) {
		if (!nextProps.fetching) {
			this.setState({
				isFetchingMore: false
			});
		}
	}

	openProfileScreen(userProfileId: number) {
		const { navigation } = this.props;
		navigation.push('ProfileScreen', { userProfileId });
	}

	renderProfileCard(item: any) {
		const { profileIdExtractor } = this.props;
		if (!item) return null;
		return (
			<TouchableNativeFeedback
				key={profileIdExtractor(item)}
				onPress={() => this.openProfileScreen(profileIdExtractor(item))}
			>
				<View>
					<ConnectedProfileCard
						key={profileIdExtractor(item)}
						userProfileId={profileIdExtractor(item)}
					/>
				</View>
			</TouchableNativeFeedback>
		);
	}

	_handleMore() {
		const { handleMore } = this.props;
		this.setState({
			isFetchingMore: true
		});
		handleMore();
	}

	render() {
		const { fetching, profileIdExtractor, data, headerComponent } = this.props;
		const { isFetchingMore } = this.state;
		const loaderClasses = isFetchingMore
			? [styles.loading, styles.loaderBottom]
			: [styles.loading, styles.loaderTop];

		return (
			<View>
				<FlatList
					keyExtractor={item => profileIdExtractor(item).toString()}
					data={data}
					ListHeaderComponent={headerComponent}
					renderItem={({ item }) => this.renderProfileCard(item)}
					onEndReached={this._handleMore}
					onEndReachedThreshold={100}
				/>
				{!!fetching && (
					<View style={loaderClasses}>
						<Throbber />
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	loading: {
		position: 'absolute',
		left: 0,
		right: 0,
		zIndex: 1
	},
	loaderTop: {
		top: 10
	},
	loaderBottom: {
		bottom: 10
	}
});

export default withNavigation(VirtualProfileList);
