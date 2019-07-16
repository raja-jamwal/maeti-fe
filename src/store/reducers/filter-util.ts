import { TypesOfFilter } from '../../components/search-filters';

// memoize this function
export const buildSearchFilter = filters => {
	// for each filter in filters
	// call the TypeOfFilter in types
	// build the TLD query
	const mustFilters: any = [];

	Object.keys(filters).forEach(filter => {
		const filterDefinition = TypesOfFilter[filter];
		if (!filterDefinition) return;
		const getFilter = filterDefinition.getSearchFilter;
		if (!getFilter) return;
		const userSelections = filters[filter];
		const searchFilter = getFilter(userSelections);
		mustFilters.push(searchFilter);
	});

	const query = {
		bool: {
			must: mustFilters
		}
	};

	return query;
};
