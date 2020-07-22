import { Tag } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { API } from '../../config/API';
import { groupBy } from 'lodash';
import { Dispatch } from 'redux';
import { IRootState } from '../index';
import { getLogger } from '../../utils/logger';
import { ApiRequest } from '../../utils';
export interface ITagsState {
	[tag_type: string]: Array<Tag>;
}

const defaultTagsState: ITagsState = {} as ITagsState;

const ADD_TAGS = 'ADD_TAGS';
export const addTags = createAction(ADD_TAGS);

export const fetchTags = () => {
	const logger = getLogger(fetchTags);
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		logger.log('fetching tags');
		return ApiRequest(API.TAG.FIND_ALL, {})
			.then((response: any) => {
				const tags = response.tags;
				const groupByType = groupBy(tags, 'tagType');
				dispatch(addTags(groupByType));
			})
			.catch(err => console.log(err));
	};
};

export const tagsReducer = handleActions<ITagsState>(
	{
		[ADD_TAGS]: (state: ITagsState, { payload }) => ({ ...payload })
	},
	defaultTagsState
);
