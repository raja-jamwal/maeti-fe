import { Favourite } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { Dispatch } from 'redux';
import { API } from '../../config/API';
import { addProfile } from './user-profile-reducer';
import { StyleSheet } from 'react-native';

export interface IFavouriteState {
	favourites: {
		[id: number]: Favourite;
	};
	fetching: boolean;
}

const defaultFavouriteState: IFavouriteState = {
	favourites: {},
	fetching: false
};

const ADD_FAVOURITE = 'ADD_FAVOURITE';
export const addFavourite = createAction<Favourite>(ADD_FAVOURITE);

const SET_FAVOURITE_FETCHING = 'SET_FAVOURITE_FETCHING';
export const setFavouriteFetching = createAction<boolean>(SET_FAVOURITE_FETCHING);

export const fetchFavouriteProfile = function(id: number) {
	return (dispatch: Dispatch<any>) => {
		console.log('fetching favourite');
		dispatch(setFavouriteFetching(true));
		return fetch(`${API.FAVOURITE.GET}?id=${id}`)
			.then(response => {
				if (response.status !== 200) {
					const error = [
						'favourite profile fetch failed for ',
						id,
						JSON.stringify(response.json())
					].join(' ');
					throw error;
				}
				return response.json();
			})
			.then(response => {
				const favourites = response.content as Array<Favourite>;
				favourites.forEach(favourite => {
					dispatch(addFavourite(favourite));
					const favouriteProfile = favourite.favouriteProfile;
					dispatch(addProfile(favouriteProfile));
				});
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
					[favourite.favouriteIdentity.id]: favourite
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
