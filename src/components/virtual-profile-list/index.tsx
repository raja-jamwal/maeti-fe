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
	handleRefresh: () => any;
}

class VirtualProfileList extends React.PureComponent<
	NavigationInjectedProps & IVirtualProfileListProps
> {
	constructor(props: any) {
		super(props);
		this.openProfileScreen = this.openProfileScreen.bind(this);
		this._handleMore = this._handleMore.bind(this);
		this.renderProfileCard = this.renderProfileCard.bind(this);
	}

	openProfileScreen(userProfileId: number) {
		const { navigation } = this.props;
		navigation.push('ProfileScreen', { userProfileId });
	}

	renderProfileCard(item: any) {
		const { profileIdExtractor } = this.props;
		if (!item) return null;
		return (
			<View style={styles.profileCardContainer}>
				<ConnectedProfileCard
					key={profileIdExtractor(item)}
					userProfileId={profileIdExtractor(item)}
					onPhotoPress={() => this.openProfileScreen(profileIdExtractor(item))}
				/>
			</View>
		);
	}

	_handleMore() {
		const { handleMore } = this.props;
		handleMore();
	}

	render() {
		const { fetching, profileIdExtractor, data, headerComponent, handleRefresh } = this.props;
		const loaderClasses = [styles.loading, styles.loaderTop];

		console.log('re-render flat-list');
		return (
			<View>
				<FlatList
					keyExtractor={item => profileIdExtractor(item).toString()}
					data={data}
					initialNumToRender={5}
					ListHeaderComponent={headerComponent}
					renderItem={({ item }) => this.renderProfileCard(item)}
					onEndReached={this._handleMore}
					onEndReachedThreshold={100}
					refreshing={fetching}
					onRefresh={handleRefresh}
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
	},
	profileCardContainer: {
		// elevation: 10,
		marginBottom: 10,
		borderColor: 'black'
	}
});

export default withNavigation(VirtualProfileList);
