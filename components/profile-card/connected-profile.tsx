import ProfileCard from './index';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { IRootState } from '../../store';

const mapStateToProps = (state: IRootState) => {
	const accountData = state.account;
	if (isEmpty(accountData)) return {};
	return { ...accountData };
};
export default connect(
	mapStateToProps,
	null
)(ProfileCard);
