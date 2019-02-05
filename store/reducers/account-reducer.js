import AccountFixture from '../../fixtures/account.json';
// [key] & account definition
const defaultAccountState = {
	[AccountFixture.accountId]: AccountFixture
};
function accountReducer(state = defaultAccountState, action) {
	return state;
}

export { accountReducer };
