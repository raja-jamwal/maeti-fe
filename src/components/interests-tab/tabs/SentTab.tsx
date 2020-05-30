import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IRootState } from '../../../store/index';
import { bindActionCreators, Dispatch } from 'redux';
import {
	fetchSentInterests,
	setSentInterestRefreshing
} from '../../../store/reducers/interest-reducer';
import { connect } from 'react-redux';
import { Interest } from '../../../store/reducers/account-defination';
import { toArray, sortBy } from 'lodash';
import VirtualProfileList from '../../virtual-profile-list/index';
import { Value } from '../../text';
import { isAccountPaid } from '../../../store/reducers/account-reducer';
interface ISentTabMapStateToProps {
	sentInterests: Array<Interest>;
	fetching: boolean;
	totalSentInterests: number;
	isAccountPaid: boolean;
}

interface ISentTabMapDispatchToProps {
	fetchSentInterests: () => any;
	setSentInterestRefreshing: () => any;
}

class SentTab extends React.Component<ISentTabMapStateToProps & ISentTabMapDispatchToProps> {
	constructor(props: any) {
		super(props);
		this._handleMore = this._handleMore.bind(this);
	}

	componentWillMount() {
		const { fetchSentInterests } = this.props;
		console.log('sent tab will mount');
		fetchSentInterests();
	}

	getSentInterests(): Array<Interest> {
		const { sentInterests } = this.props;
		return sortBy(toArray(sentInterests), 'createdOn').reverse();
	}

	profileIdExtractor(interest: Interest) {
		return interest.toUser.id;
	}
	profileNameExtractor(interest: Interest) {
		return interest.toUser.fullName;
	}

	totalCount() {
		const { fetching, totalSentInterests } = this.props;
		if (fetching) return null;
		return (
			<View style={styles.totalCountContainer}>
				<Value>{totalSentInterests} Sent Interests</Value>
			</View>
		);
	}

	async _handleMore() {
		const { fetchSentInterests } = this.props;
		await fetchSentInterests();
	}

	async handleRefreshing() {
		const { setSentInterestRefreshing } = this.props;
		await setSentInterestRefreshing();
		await this._handleMore();
	}

	render() {
		const { fetching, isAccountPaid } = this.props;
		return (
			<VirtualProfileList
				fetching={fetching}
				data={this.getSentInterests()}
				profileIdExtractor={this.profileIdExtractor}
				profileNameExtractor={this.profileNameExtractor}
				// headerComponent={this.totalCount()}
				handleMore={this._handleMore}
				handleRefresh={() => this.handleRefreshing()}
				isAccountPaid={isAccountPaid}
			/>
		);
	}
}

const styles = StyleSheet.create({
	totalCountContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 15
	}
});

const mapStateToProps = (state: IRootState) => {
	const sentInterests = state.interests.sent.profiles;
	const fetching = state.interests.sent.fetching;
	const totalSentInterests = state.interests.sent.pageable.totalElements;
	return {
		sentInterests,
		fetching,
		totalSentInterests,
		isAccountPaid: isAccountPaid(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchSentInterests: bindActionCreators(fetchSentInterests, dispatch),
		setSentInterestRefreshing: bindActionCreators(setSentInterestRefreshing, dispatch)
	};
};

const connectedSentTab = connect(
	mapStateToProps,
	mapDispatchToProps
)(SentTab);

export default connectedSentTab;
