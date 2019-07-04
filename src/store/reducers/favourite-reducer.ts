import { Favourite, Pageable } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { addProfile } from './user-profile-reducer';
import { ApiRequest } from '../../utils/index';
import { IRootState } from '../index';
import { extractPageableResponse } from '../../utils/extract-pageable-response';

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

const ADD_FAVOURITE = 'ADD_FAVOURITE';
export const addFavourite = createAction<Favourite>(ADD_FAVOURITE);

const ADD_FAVOURITE_PAGE = 'ADD_FAVOURITE_PAGE';
export const addFavouritePage = createAction<Pageable>(ADD_FAVOURITE_PAGE);

const SET_FAVOURITE_FETCHING = 'SET_FAVOURITE_FETCHING';
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

				items.forEach(favourite => {
					dispatch(addFavourite(favourite));
					const favouriteProfile = favourite.favouriteUserProfile;
					dispatch(addProfile(favouriteProfile));
				});

				dispatch(addFavouritePage(page));
				dispatch(setFavouriteFetching(false));
			})
			.catch(err => {
				console.log('fetch failed for favourite ', err);
				dispatch(setFavouriteFetching(false));
			});
	};
};

export const favouriteReducer = handleActions<IFavouriteState>(
	{
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
			return {
				...state,
				pageable: {
					...page
				}
			};
		},
		[SET_FAVOURITE_FETCHING]: (state, { payload }) => {
			const fetching = !!payload;
			return {
				...state,
				fetching
			};
		}
	},
	defaultFavouriteState
);
