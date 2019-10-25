import { TypesOfFilter } from '../../components/search-filters';
import { isEmpty, get } from 'lodash';
import { Tag, UserProfile } from './account-defination';

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

export const buildAddedToFavouriteFilter = (currentProfileId: number) => {
	return {
		bool: {
			must: [
				{
					term: {
						userProfileId: currentProfileId
					}
				}
			]
		}
	};
};

export const buildViewedMyProfileFilter = (currentProfileId: number) => {
	return {
		bool: {
			must: [
				{
					term: {
						userProfileId: currentProfileId
					}
				}
			]
		}
	};
};

export const buildViewedMyContactFilter = (currentProfileId: number) => {
	return {
		bool: {
			must: [
				{
					term: {
						userProfileId: currentProfileId
					}
				}
			]
		}
	};
};

export const buildLocationFilter = (userProfile: UserProfile) => {
	const filters: any = [];

	/*
		Find in all work & family locations
	 */

	const fields = [
		'profession.workCountry.id',
		'profession.workState.id',
		'profession.workCity.id',
		'family.familyCountry.id',
		'family.familyState.id',
		'family.familyCity.id'
	];

	fields.forEach(field => {
		const value = get(userProfile, field);
		if (!value) return;
		filters.push({
			term: {
				[field]: value
			}
		});
	});

	return {
		bool: {
			should: filters
		}
	};
};

export const buildCommunityFilter = (userProfile: UserProfile) => {
	const filters: any[] = [];

	const castes = get(userProfile, 'horoscope.caste', []) as Tag[];
	const subCastes = get(userProfile, 'horoscope.subCaste', []) as Tag[];

	castes.forEach(caste =>
		filters.push({
			term: {
				'horoscope.caste.id': caste.id
			}
		})
	);

	subCastes.forEach(subCaste =>
		filters.push({
			term: {
				'horoscope.subCaste.id': subCaste.id
			}
		})
	);

	return {
		bool: {
			should: filters
		}
	};
};
