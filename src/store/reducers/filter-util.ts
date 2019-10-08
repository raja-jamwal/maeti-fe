import { TypesOfFilter } from '../../components/search-filters';
import { isEmpty } from 'lodash';

// probably memoize this function
export const buildSearchFilter = (filters: any, currentProfileId: number) => {
	/*
		For each filter in filters (selected from FilterScreen)
		find the definition from TypeOfFilter &
		build the ES Bool DSL query
	 */
	const mustFilters: any = [];

	Object.keys(filters).forEach(filter => {
		const filterDefinition = TypesOfFilter[filter];
		if (!filterDefinition) return;
		const getFilter = filterDefinition.getSearchFilter;
		if (!getFilter) return;
		const userSelections = filters[filter];
		/*
			If there are no user selections for this filter
			we don't want to add it to query
		 */
		if (isEmpty(userSelections)) return;
		const searchFilter = getFilter(userSelections);
		mustFilters.push(searchFilter);
	});

	const query = {
		bool: {
			must: mustFilters,
			must_not: {
				term: {
					id: currentProfileId
				}
			}
		}
	};

	return query;
};
