import { applyMiddleware, combineReducers, createStore } from 'redux';
import { accountReducer, IAccountState } from './reducers/account-reducer';
import thunk from 'redux-thunk';
import { IUserProfileState, userProfileReducer } from './reducers/user-profile-reducer';
import { ITagsState, tagsReducer } from './reducers/tag-reducer';
import { favouriteReducer, IFavouriteState } from './reducers/favourite-reducer';
import { ISelfProfileState, selfProfileReducer } from './reducers/self-profile-reducer';
import { IInterestState, interestReducer } from './reducers/interest-reducer';
import { channelReducer, IChannelState } from './reducers/channel-reducer';
import { IMessageState, messageReducer } from './reducers/message-reducer';

export interface IRootState {
	account: IAccountState;
	userProfiles: IUserProfileState;
	selfProfile: ISelfProfileState;
	tags: ITagsState;
	favourites: IFavouriteState;
	interests: IInterestState;
	channels: IChannelState;
	messages: IMessageState;
}

const rootReducer = combineReducers<IRootState>({
	account: accountReducer,
	userProfiles: userProfileReducer,
	selfProfile: selfProfileReducer,
	tags: tagsReducer,
	favourites: favouriteReducer,
	interests: interestReducer,
	channels: channelReducer,
	messages: messageReducer
});

const store = createStore<IRootState, any, any, any>(rootReducer, applyMiddleware(thunk));

export { rootReducer, store };
