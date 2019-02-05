import React from 'react';
import ProfileCard from './index';
import { connect } from 'react-redux';

const mapStateToProps = (state, props) => {
	const accountId = props.accountId;
	if (!accountId) throw 'Need accountId';
	const accountData = state.accounts[accountId];
	return { ...accountData };
};
export default connect(
	mapStateToProps,
	null
)(ProfileCard);
