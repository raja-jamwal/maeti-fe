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
import { exploreReducer, IExploreState } from './reducers/explore-reducer';
import { filterReducer, IFilterState } from './reducers/filter-reducer';
import rtmMiddleware from './middleware/rtm';

export interface IRootState {
	account: IAccountState;
	explore: IExploreState;
	userProfiles: IUserProfileState;
	selfProfile: ISelfProfileState;
	tags: ITagsState;
	favourites: IFavouriteState;
	interests: IInterestState;
	channels: IChannelState;
	messages: IMessageState;
	filter: IFilterState;
}

const rootReducer = combineReducers<IRootState>({
	account: accountReducer,
	explore: exploreReducer,
	userProfiles: userProfileReducer,
	selfProfile: selfProfileReducer,
	tags: tagsReducer,
	favourites: favouriteReducer,
	interests: interestReducer,
	channels: channelReducer,
	messages: messageReducer,
	filter: filterReducer
});

const store = createStore<IRootState, any, any, any>(
	rootReducer,
	applyMiddleware(thunk, rtmMiddleware)
);

export { rootReducer, store };
