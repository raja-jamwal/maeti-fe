import { Pageable, UserProfile } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { extractSearchResult } from '../../utils/extract-search-result';
import { IRootState } from '../index';
import { bulkAddProfile } from './user-profile-reducer';
import { getLogger } from '../../utils/logger';
import { buildSearchFilter } from './filter-util';

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

const defaultScreenData: IScreenData = {
	profiles: {},
	fetching: false,
	pageable: {
		last: false,
		totalPages: 0,
		number: -1,
		totalElements: 0
	}
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

enum ACTIONS {
	CHANGE_SELECTED_SCREEN = 'CHANGE_SELECTED_SCREEN',
	SET_FETCHING_FOR_SCREEN = 'SET_FETCHING_FOR_SCREEN',
	SET_SEARCH_RESULT_FOR_SCREEN = 'SET_SEARCH_RESULT_FOR_SCREEN'
}

export const changeSelectedExploreScreen = createAction<string>(ACTIONS.CHANGE_SELECTED_SCREEN);

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

		// default match everything
		// this is show stopper for production
		let searchQuery: any = {
			match_all: {}
		};

		switch (selectedScreen) {
			case 'search':
				searchQuery = buildSearchFilter(getState().filter.filters);
				break;
		}

		const query = {
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

		query.query = searchQuery;

		logger.log('Search Filter', query.query);

		logger.log(JSON.stringify(query.query));

		return fetch(API.SEARCH.GET, {
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
				const { items, total } = extractSearchResult(json);
				const pageable: Pageable = {
					totalElements: total,
					totalPages: 0,
					last: storeItemsCount === total,
					number: 0
				};
				logger.log('es items ', items.length);
				dispatch(
					setSearchResultForScreen({ profiles: items, pageable, screen: selectedScreen })
				);
				dispatch(bulkAddProfile(items));
				dispatch(setFetchingForScreen({ fetching: false, screen: selectedScreen }));
			})
			.catch(err => {
				console.log('err ', err);
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
