import * as React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ConnectedProfileCard from '../profile-card/connected-profile';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { MASKED_PROFILE_NAME } from '../../constants/index';
interface IVirtualProfileListProps {
	fetching?: boolean;
	profileIdExtractor: (item: any) => number;
	profileNameExtractor: (item: any) => string;
	data: Array<any>;
	headerComponent?: any;
	handleMore: () => any;
	handleRefresh: () => any;
	isAccountPaid: boolean;
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

	openProfileScreen(userProfileId: number, profileName: string) {
		const { navigation, isAccountPaid } = this.props;
		if (!isAccountPaid) {
			profileName = MASKED_PROFILE_NAME;
		}
		navigation.push('ProfileScreen', { userProfileId, profileName });
	}

	renderProfileCard(item: any) {
		const { profileIdExtractor, profileNameExtractor } = this.props;

		if (!item) return null;
		return (
			<View style={styles.profileCardContainer}>
				<ConnectedProfileCard
					key={profileIdExtractor(item)}
					userProfileId={profileIdExtractor(item)}
					onPhotoPress={() =>
						this.openProfileScreen(profileIdExtractor(item), profileNameExtractor(item))
					}
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
					// initialNumToRender={5}
					ListHeaderComponent={headerComponent || null}
					renderItem={({ item }) => this.renderProfileCard(item)}
					onEndReached={this._handleMore}
					onEndReachedThreshold={100}
					refreshing={fetching}
					onRefresh={handleRefresh}
				/>
				{/*{!!fetching && (
					<View style={loaderClasses}>
						<Throbber />
					</View>
				)}*/}
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
		// elevation: 10
		// marginBottom: 10,
		// borderColor: 'black'
	}
});

export default withNavigation(VirtualProfileList);
