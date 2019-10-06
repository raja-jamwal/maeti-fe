import { createAction, handleActions } from 'redux-actions';
import { IRootState } from '../index';
import { createSelector } from 'reselect';
import {
	changeSelectedExploreScreen,
	clearSearchResultForScreen,
	fetchSearchResult
} from './explore-reducer';
import { Dispatch } from 'redux';

export interface IFilterState {
	filters: any;
	saved_filters: any;
}

export const defaultFilterState: IFilterState = {
	filters: {},
	saved_filters: {}
};

enum ACTIONS {
	SET_SEARCH_FILTER = 'SET_SEARCH_FILTER'
}

// selectors
export const getFilterState = (state: IRootState) => state.filter;
export const getSearchFilter = createSelector(
	getFilterState,
	filter => filter.filters
);

// actions
export const setSearchFilter = createAction<any>(ACTIONS.SET_SEARCH_FILTER);
export const applyFilter = function(filter: any) {
	return (dispatch: Dispatch<any>) => {
		dispatch(setSearchFilter(filter));
		dispatch(clearSearchResultForScreen('search'));
		dispatch(changeSelectedExploreScreen('search'));
		dispatch(fetchSearchResult());
	};
};

export const applyGlobalFilter = function(search: string) {
	return (dispatch: Dispatch<any>) => {
		const filter = {
			search
		};
		dispatch(setSearchFilter(filter));
		dispatch(clearSearchResultForScreen('search'));
		dispatch(changeSelectedExploreScreen('search'));
		dispatch(fetchSearchResult());
	};
};

export const filterReducer = handleActions(
	{
		[ACTIONS.SET_SEARCH_FILTER]: (state, { payload }) => {
			return {
				...state,
				filters: {
					...payload
				}
			};
		}
	},
	defaultFilterState
);
