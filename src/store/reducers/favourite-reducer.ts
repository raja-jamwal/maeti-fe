import { Favourite, Pageable } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { bulkAddProfile } from './user-profile-reducer';
import { ApiRequest } from '../../utils/index';
import { IRootState } from '../index';
import { extractPageableResponse } from '../../utils/extract-pageable-response';
import { createSelector } from 'reselect';

export interface IFavouriteState {
	favourites: {
		[favouriteProfileId: number]: Favourite;
	};
	fetching: boolean;
	pageable: Pageable;
}

const defaultFavouriteState: IFavouriteState = {
	favourites: {},
	fetching: false,
	pageable: {
		last: false,
		totalPages: 0,
		number: -1,
		totalElements: 0
	}
};

interface IBulkAddFavouriteResponse {
	favourites: Array<Favourite>;
	pageable: Pageable;
	fetching: boolean;
}

// selectors
export const getFavouriteState = (state: IRootState) => state.favourites;
export const getFavouriteProfiles = createSelector(
	getFavouriteState,
	favourites => favourites.favourites
);
export const getFavouriteFetching = createSelector(
	getFavouriteState,
	favourites => favourites.fetching
);
export const getFavouritePage = createSelector(
	getFavouriteState,
	favourites => favourites.pageable
);
export const getTotalElements = createSelector(
	getFavouritePage,
	pageable => pageable.totalElements
);

// actions
const ADD_FAVOURITE = 'ADD_FAVOURITE';
const BULK_ADD_FAVOURITE = 'BULK_ADD_FAVOURITE';
const ADD_FAVOURITE_PAGE = 'ADD_FAVOURITE_PAGE';
// super performant to reduce render cycles
const BULK_ADD_FAVOURITE_RESPONSE = 'BULK_ADD_FAVOURITE_RESPONSE';
const SET_FAVOURITE_FETCHING = 'SET_FAVOURITE_FETCHING';

export const addFavourite = createAction<Favourite>(ADD_FAVOURITE);
export const bulkAddFavourite = createAction<Array<Favourite>>(BULK_ADD_FAVOURITE);
export const bulkAddFavouriteResponse = createAction<IBulkAddFavouriteResponse>(
	BULK_ADD_FAVOURITE_RESPONSE
);
export const addFavouritePage = createAction<Pageable>(ADD_FAVOURITE_PAGE);
export const setFavouriteFetching = createAction<boolean>(SET_FAVOURITE_FETCHING);

export const fetchFavouriteProfile = function(id: number) {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const currentPage = getState().favourites.pageable;
		if (currentPage.last) return;

		console.log('fetching favourite');
		dispatch(setFavouriteFetching(true));

		const pageToRequest = currentPage.number + 1;
		return ApiRequest(API.FAVOURITE.LIST, {
			favouriteOfUserId: id,
			page: pageToRequest
		})
			.then((response: any) => {
				const { items, page } = extractPageableResponse<Favourite>(response);

				const bulkAddResponse: IBulkAddFavouriteResponse = {
					favourites: items,
					pageable: page,
					fetching: false
				};

				dispatch(bulkAddFavouriteResponse(bulkAddResponse));
				const profiles = items.map(item => item.favouriteUserProfile);
				dispatch(bulkAddProfile(profiles));
			})
			.catch(err => {
				console.log('fetch failed for favourite ', err);
				dispatch(setFavouriteFetching(false));
			});
	};
};

const bulkAddFavouriteEffect = (state: IFavouriteState, favourites: Array<Favourite>) => {
	const favouritesByKey: any = {};
	favourites.forEach(favourite => {
		favouritesByKey[favourite.favouriteIdentity.favouriteProfileId] = favourite;
	});
	return {
		...state,
		favourites: {
			...state.favourites,
			...favouritesByKey
		}
	};
};

const addFavouritePageEffect = (state: IFavouriteState, page: Pageable) => {
	return {
		...state,
		pageable: {
			...page
		}
	};
};

const setFavouriteFetchingEffect = (state: IFavouriteState, fetching: boolean) => {
	return {
		...state,
		fetching
	};
};

export const favouriteReducer = handleActions<IFavouriteState>(
	{
		[BULK_ADD_FAVOURITE]: (state, { payload }) => {
			const favourites = (payload as any) as Array<Favourite>;
			return bulkAddFavouriteEffect(state, favourites);
		},
		[ADD_FAVOURITE]: (state, { payload }) => {
			const favourite = (payload as any) as Favourite;
			const existingFavs = state.favourites;
			return {
				...state,
				favourites: {
					...existingFavs,
					[favourite.favouriteIdentity.favouriteProfileId]: favourite
				}
			};
		},
		[ADD_FAVOURITE_PAGE]: (state, { payload }) => {
			const page = (payload as any) as Pageable;
			return addFavouritePageEffect(state, page);
		},
		[SET_FAVOURITE_FETCHING]: (state, { payload }) => {
			const fetching = !!payload;
			return setFavouriteFetchingEffect(state, fetching);
		},
		[BULK_ADD_FAVOURITE_RESPONSE]: (state, { payload }) => {
			const response = (payload as any) as IBulkAddFavouriteResponse;
			let newState = bulkAddFavouriteEffect(state, response.favourites);
			newState = addFavouritePageEffect(newState, response.pageable);
			newState = setFavouriteFetchingEffect(newState, response.fetching);
			return newState;
		}
	},
	defaultFavouriteState
);
