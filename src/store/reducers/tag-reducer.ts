import { Tag } from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { API } from '../../config/API';
import { groupBy } from 'lodash';
import { Dispatch } from 'redux';
import { IRootState } from '../index';
import { isEmpty } from 'lodash';
import { getLogger } from '../../utils/logger';
export interface ITagsState {
	[tag_type: string]: Array<Tag>;
}

const defaultTagsState: ITagsState = {} as ITagsState;

const ADD_TAGS = 'ADD_TAGS';
export const addTags = createAction(ADD_TAGS);

export const fetchTags = () => {
	const logger = getLogger(fetchTags);
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		// not using rule in account-reducer
		// because of cyclic dependancy
		const account = getState().account;
		if (isEmpty(account) || isEmpty(account.token)) {
			return logger.log('need account & token to search');
		}
		return fetch(`${API.TAGS}?size=300`, {
			method: 'GET',
			headers: {
				Authorization: account.token
			}
		})
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
