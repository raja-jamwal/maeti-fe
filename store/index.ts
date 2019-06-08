import { applyMiddleware, combineReducers, createStore } from 'redux';
import { accountReducer, IAccountState } from './reducers/account-reducer';
import thunk from 'redux-thunk';
import { IUserProfileState, userProfileReducer } from './reducers/user-profile-reducer';
import { ITagsState, tagsReducer } from './reducers/tag-reducer';

export interface IRootState {
	account: IAccountState;
	userProfiles:  IUserProfileState;
	tags: ITagsState;
}

const rootReducer = combineReducers<IRootState>({
	account: accountReducer,
	userProfiles: userProfileReducer,
	tags: tagsReducer
});

const store = createStore<IRootState, any, any, any>(rootReducer, applyMiddleware(thunk));

export { rootReducer, store };
