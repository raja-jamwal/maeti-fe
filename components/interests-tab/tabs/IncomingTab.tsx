import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IRootState } from '../../../store';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { fetchIncomingInterests } from '../../../store/reducers/interest-reducer';
import { Interest } from '../../../store/reducers/account-defination';
import VirtualProfileList from '../../virtual-profile-list';
import { toArray, sortBy } from 'lodash';

interface IIncomingTabMapStateToProps {
	incomingInterests: Array<Interest>;
	fetching: boolean;
	totalIncomingInterests: number;
}

interface IIncomingTabMapDispatchToProps {
	fetchIncomingInterests: () => any;
}

class IncomingTab extends React.PureComponent<
	IIncomingTabMapStateToProps & IIncomingTabMapDispatchToProps
> {
	constructor(props: any) {
		super(props);
		this._handleMore = this._handleMore.bind(this);
	}

	componentWillMount() {
		const { fetchIncomingInterests } = this.props;
		fetchIncomingInterests();
	}

	getIncomingInterests(): Array<Interest> {
		const { incomingInterests } = this.props;
		return sortBy(toArray(incomingInterests), 'updatedOn');
	}

	profileIdExtractor(interest: Interest) {
		return interest.fromUser.id;
	}

	totalCount() {
		const { fetching, totalIncomingInterests } = this.props;
		if (fetching) return null;
		return (
			<View style={styles.totalCountContainer}>
				<Text>{totalIncomingInterests} Incoming Interests</Text>
			</View>
		);
	}

	_handleMore() {
		const { fetchIncomingInterests } = this.props;
		fetchIncomingInterests();
	}

	render() {
		const { fetching } = this.props;
		return (
			<VirtualProfileList
				fetching={fetching}
				data={this.getIncomingInterests()}
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
	const incomingInterests = state.interests.incoming.profiles;
	const fetching = state.interests.incoming.fetching;
	const totalIncomingInterests = state.interests.incoming.pageable.totalElements;

	return {
		incomingInterests,
		fetching,
		totalIncomingInterests
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchIncomingInterests: bindActionCreators(fetchIncomingInterests, dispatch)
	};
};

const connectedIncomingTab = connect(
	mapStateToProps,
	mapDispatchToProps
)(IncomingTab);

export default connectedIncomingTab;
