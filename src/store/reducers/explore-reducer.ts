import { Favourite, Pageable, UserProfile } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { extractSearchResult } from '../../utils/extract-search-result';
import { IRootState } from '../index';
import { bulkAddProfile, getUserProfileForId } from './user-profile-reducer';
import { getLogger } from '../../utils/logger';
import {
	buildAddedToFavouriteFilter,
	buildCommunityFilter,
	buildLocationFilter,
	buildSearchFilter,
	buildViewedMyContactFilter,
	buildViewedMyProfileFilter
} from './filter-util';
import { createSelector } from 'reselect';
import { getCurrentUserProfile, getCurrentUserProfileId } from './self-profile-reducer';
import { extractPageableResponse } from '../../utils/extract-pageable-response';

export interface IScreenData {
	profiles: {
		[profileId: number]: UserProfile;
	};
	fetching: boolean;
	pageable: Pageable;
}

export interface IExploreState {
	search: IScreenData;
	discover: IScreenData;
	new_matches: IScreenData;
	reverse_matches: IScreenData;
	my_matches: IScreenData;
	mutual_matches: IScreenData;
	community_matches: IScreenData;
	location_matches: IScreenData;
	added_me: IScreenData;
	viewed_contact: IScreenData;
	viewed_profile: IScreenData;
	selected_screen: string;
}

const defaultPageable = {
	last: false,
	totalPages: 0,
	number: -1,
	totalElements: 0
};

const defaultScreenData: IScreenData = {
	profiles: {},
	fetching: false,
	pageable: defaultPageable
};

const defaultExploreState: IExploreState = {
	search: defaultScreenData,
	discover: defaultScreenData,
	new_matches: defaultScreenData,
	reverse_matches: defaultScreenData,
	my_matches: defaultScreenData,
	mutual_matches: defaultScreenData,
	community_matches: defaultScreenData,
	location_matches: defaultScreenData,
	added_me: defaultScreenData,
	viewed_contact: defaultScreenData,
	viewed_profile: defaultScreenData,
	selected_screen: 'discover'
};

// Rules
export const getExploreState = (state: IRootState) => state.explore;
export const getSelectedScreen = createSelector(
	getExploreState,
	explore => explore.selected_screen
);

enum ACTIONS {
	CHANGE_SELECTED_SCREEN = 'CHANGE_SELECTED_SCREEN',
	SET_FETCHING_FOR_SCREEN = 'SET_FETCHING_FOR_SCREEN',
	SET_SEARCH_RESULT_FOR_SCREEN = 'SET_SEARCH_RESULT_FOR_SCREEN',
	CLEAR_SEARCH_RESULT_FOR_SCREEN = 'CLEAR_SEARCH_RESULT_FOR_SCREEN'
}

export const changeSelectedExploreScreen = createAction<string>(ACTIONS.CHANGE_SELECTED_SCREEN);
export const clearSearchResultForScreen = createAction<string>(
	ACTIONS.CLEAR_SEARCH_RESULT_FOR_SCREEN
);

interface ISetFetchingForScreenPayload {
	fetching: boolean;
	screen: string;
}

export const setFetchingForScreen = createAction<ISetFetchingForScreenPayload>(
	ACTIONS.SET_FETCHING_FOR_SCREEN
);

interface ISetSearchResultForScreen {
	profiles: Array<UserProfile>;
	pageable: Pageable;
	screen: string;
}

export const setSearchResultForScreen = createAction<ISetSearchResultForScreen>(
	ACTIONS.SET_SEARCH_RESULT_FOR_SCREEN
);

export const mayBeFetchSearchResult = function(screen: string) {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		if (!screen) return;
		dispatch(changeSelectedExploreScreen(screen));
		dispatch(fetchSearchResult());
	};
};

export const fetchSearchResult = function() {
	const logger = getLogger(fetchSearchResult);
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const selectedScreen = getState().explore.selected_screen;
		if (!selectedScreen) return;

		const currentScreen = (getState().explore[selectedScreen] as any) as IScreenData;
		if (!currentScreen) return;

		const pageable = currentScreen.pageable;

		if (pageable.last) return;

		dispatch(setFetchingForScreen({ fetching: true, screen: selectedScreen }));

		const storeItemsCount = Object.keys(currentScreen.profiles).length;

		const currentUserProfileId = getCurrentUserProfileId(getState());
		if (!currentUserProfileId) return;
		const currentUserProfile = getUserProfileForId(getState(), currentUserProfileId);
		if (!currentUserProfile) return;

		/*
			Default to elastic Search
			1. At the moment reverse_matches is run through DB,
			   for reverse_matches we'll take different flow
		 */

		let searchUrl = `${API.SEARCH.GET}/${currentUserProfileId}`;
		let query: any = {
			from: storeItemsCount,
			size: 10,
			sort: [
				{
					updatedOn: {
						order: 'desc'
					}
				}
			],
			query: {}
		};

		const isMutualMatchQuery = selectedScreen === 'mutual_matches';

		if (!isMutualMatchQuery) {
			/*
				Fallback to match all ES documents
			 */
			let searchQuery: any = {
				match_all: {}
			};

			//
			// TODO: all filter builders should include must_not for the current user profile
			//

			switch (selectedScreen) {
				case 'search':
					searchUrl = `${API.SEARCH.GET}/${currentUserProfileId}`;
					searchQuery = buildSearchFilter(
						getState().filter.filters,
						currentUserProfileId
					);
					break;
				case 'community_matches':
					searchUrl = `${API.SEARCH.GET}/${currentUserProfileId}`;
					searchQuery = buildCommunityFilter(currentUserProfile);
					break;
				case 'location_matches':
					searchUrl = `${API.SEARCH.GET}/${currentUserProfileId}`;
					searchQuery = buildLocationFilter(currentUserProfile);
					break;
				case 'added_me':
					searchUrl = `${API.ADDED_TO_FAVOURITE.SEARCH}/${currentUserProfileId}`;
					searchQuery = buildAddedToFavouriteFilter(currentUserProfileId);
					break;
				case 'viewed_contact':
					searchUrl = `${API.VIEWED_MY_CONTACT.SEARCH}/${currentUserProfileId}`;
					searchQuery = buildViewedMyContactFilter(currentUserProfileId);
					break;
				case 'viewed_profile':
					searchUrl = `${API.VIEWED_MY_PROFILE.SEARCH}/${currentUserProfileId}`;
					searchQuery = buildViewedMyProfileFilter(currentUserProfileId);
					break;
			}

			query.query = searchQuery;
			logger.log('Search Filter', query.query);
			logger.log(JSON.stringify(query.query));
		} else {
			/*
				Handle for reverse_matches
			 */
			logger.log('handling for reverse_matches');
			searchUrl = `${API.ADDED_TO_FAVOURITE.MUTUAL_MATCHES}/${currentUserProfileId}`;
			const pageToRequest = pageable.number + 1;
			query = {
				page: pageToRequest
			};
		}

		return fetch(searchUrl, {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		})
			.then(response => {
				if (response.status !== 200) {
					throw response.json();
				}
				return response.json();
			})
			.then(json => {
				let items = [];
				let pageable: Pageable = defaultPageable;

				if (!isMutualMatchQuery) {
					const extractableSearchResult = extractSearchResult(json);
					items = extractableSearchResult.items;
					const total = extractableSearchResult.total;
					pageable = {
						totalElements: total,
						totalPages: 0,
						last: storeItemsCount === total,
						number: 0
					};
					logger.log('es items ', items.length);
				} else {
					const extractablePageableResponse = extractPageableResponse<Favourite>(json);
					items = extractablePageableResponse.items.map(s => s.favouriteUserProfile);
					pageable = extractablePageableResponse.page;
				}

				dispatch(
					setSearchResultForScreen({ profiles: items, pageable, screen: selectedScreen })
				);
				dispatch(bulkAddProfile(items));
				dispatch(setFetchingForScreen({ fetching: false, screen: selectedScreen }));
			})
			.catch(err => {
				logger.log('err ', err);
				dispatch(setFetchingForScreen({ fetching: false, screen: selectedScreen }));
			});
	};
};

export const exploreReducer = handleActions(
	{
		[ACTIONS.CHANGE_SELECTED_SCREEN]: (state, { payload }) => {
			const selected_screen = (payload as any) as string;
			return {
				...state,
				selected_screen
			};
		},
		[ACTIONS.CLEAR_SEARCH_RESULT_FOR_SCREEN]: (state, { payload }) => {
			const screen = (payload as any) as string;
			return {
				...state,
				[screen]: defaultScreenData
			};
		},
		[ACTIONS.SET_FETCHING_FOR_SCREEN]: (state, { payload }) => {
			const { fetching, screen } = (payload as any) as ISetFetchingForScreenPayload;
			return {
				...state,
				[screen]: {
					...state[screen],
					fetching: fetching
				}
			};
		},
		[ACTIONS.SET_SEARCH_RESULT_FOR_SCREEN]: (state, { payload }) => {
			const { profiles, pageable, screen } = (payload as any) as ISetSearchResultForScreen;
			const profilesByKey: any = {};
			profiles.forEach(profile => {
				profilesByKey[profile.id] = profile;
			});
			return {
				...state,
				[screen]: {
					...state[screen],
					profiles: {
						...state[screen].profiles,
						...profilesByKey
					},
					pageable: {
						...pageable
					}
				}
			};
		}
	},
	defaultExploreState
);
