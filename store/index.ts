import { applyMiddleware, combineReducers, createStore } from 'redux';
import { accountReducer, IAccountState } from './reducers/account-reducer';
import thunk from 'redux-thunk';
import { IUserProfileState, userProfileReducer } from './reducers/user-profile-reducer';
import { ITagsState, tagsReducer } from './reducers/tag-reducer';
import { favouriteReducer, IFavouriteState } from './reducers/favourite-reducer';

export interface IRootState {
	account: IAccountState;
	userProfiles: IUserProfileState;
	tags: ITagsState;
	favourites: IFavouriteState;
}

const rootReducer = combineReducers<IRootState>({
	account: accountReducer,
	userProfiles: userProfileReducer,
	tags: tagsReducer,
	favourites: favouriteReducer
});

const store = createStore<IRootState, any, any, any>(rootReducer, applyMiddleware(thunk));

export { rootReducer, store };
