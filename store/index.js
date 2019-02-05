import { combineReducers, createStore } from 'redux';
import { accountReducer } from './reducers/account-reducer';

const rootReducer = combineReducers({
	accounts: accountReducer
});

const store = createStore(rootReducer);

export { rootReducer, store };
