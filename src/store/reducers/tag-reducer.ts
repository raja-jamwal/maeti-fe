import { Tag } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { API } from '../../config/API';
import { groupBy } from 'lodash';
import { Dispatch } from 'redux';

export interface ITagsState {
	[tag_type: string]: Array<Tag>;
}

const defaultTagsState: ITagsState = {} as ITagsState;

const ADD_TAGS = 'ADD_TAGS';
export const addTags = createAction(ADD_TAGS);

export const fetchTags = () => {
	return (dispatch: Dispatch<any>) => {
		return fetch(`${API.TAGS}?size=300`)
			.then(response => response.json())
			.then(embedded => {
				const tags = embedded._embedded.tags;
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
