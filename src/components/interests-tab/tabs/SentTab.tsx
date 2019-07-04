import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IRootState } from '../../../store/index';
import { bindActionCreators, Dispatch } from 'redux';
import { fetchSentInterests } from '../../../store/reducers/interest-reducer';
import { connect } from 'react-redux';
import { Interest } from '../../../store/reducers/account-defination';
import { toArray, sortBy } from 'lodash';
import VirtualProfileList from '../../virtual-profile-list/index';

interface ISentTabMapStateToProps {
	sentInterests: Array<Interest>;
	fetching: boolean;
	totalSentInterests: number;
}

interface ISentTabMapDispatchToProps {
	fetchSentInterests: () => any;
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
		return sortBy(toArray(sentInterests), 'updatedOn');
	}

	profileIdExtractor(interest: Interest) {
		return interest.toUser.id;
	}

	totalCount() {
		const { fetching, totalSentInterests } = this.props;
		if (fetching) return null;
		return (
			<View style={styles.totalCountContainer}>
				<Text>{totalSentInterests} Sent Interests</Text>
			</View>
		);
	}

	_handleMore() {
		const { fetchSentInterests } = this.props;
		fetchSentInterests();
	}

	render() {
		const { fetching } = this.props;
		return (
			<VirtualProfileList
				fetching={fetching}
				data={this.getSentInterests()}
				profileIdExtractor={this.profileIdExtractor}
				headerComponent={this.totalCount()}
				handleMore={this._handleMore}
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
		totalSentInterests
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchSentInterests: bindActionCreators(fetchSentInterests, dispatch)
	};
};

const connectedSentTab = connect(
	mapStateToProps,
	mapDispatchToProps
)(SentTab);

export default connectedSentTab;
