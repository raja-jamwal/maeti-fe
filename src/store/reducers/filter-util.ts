import { TypesOfFilter } from '../../components/search-filters';
import { isEmpty, get, isArray } from 'lodash';
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

const createTermFilter = (key: string, value: string | number) => {
	return {
		term: {
			[key]: value
		}
	};
};

export const buildNewMatchesFilter = (userProfile: UserProfile) => {
	const preference = userProfile.preference;
	const mustFilters = [];

	if (preference.maritalStatus) {
		mustFilters.push(createTermFilter('maritalStatus.keyword', preference.maritalStatus));
	}

	// handle range for
	// 1. differenceHeight
	// 2. differenceAge

	if (preference.education) {
		mustFilters.push(
			createTermFilter('education.highestEducationLevel.keyword', preference.education)
		);
	}

	if (preference.mediumOfEducation) {
		mustFilters.push(
			createTermFilter('education.mediumOfEducation.keyword', preference.mediumOfEducation)
		);
	}

	if (preference.workingPartner) {
		mustFilters.push(
			createTermFilter('preference.workingPartner.keyword', preference.workingPartner)
		);
	}

	if (preference.occupation) {
		mustFilters.push(createTermFilter('profession.occupation.keyword', preference.occupation));
	}

	// all location matches

	if (preference.diet) {
		mustFilters.push(createTermFilter('lifestyle.diet.keyword', preference.diet));
	}

	if (preference.smoke) {
		mustFilters.push(createTermFilter('lifestyle.smoking.keyword', preference.smoke));
	}

	if (preference.hoteling) {
		mustFilters.push(createTermFilter('lifestyle.hoteling.keyword', preference.hoteling));
	}

	if (preference.partying) {
		mustFilters.push(createTermFilter('lifestyle.partying.keyword', preference.partying));
	}

	// where to map this?
	// if (preference.cooking) {
	// 	mustFilters.push(createTermFilter('preference.cooking.keyword', preference.cooking));
	// }

	// caste
	if (!isEmpty(preference.caste) && isArray(preference.caste)) {
		preference.caste.forEach(caste => {
			mustFilters.push({
				bool: {
					should: createTermFilter('horoscope.caste.id', caste.id)
				}
			});
		});
	}

	// subCaste
	if (!isEmpty(preference.subCaste) && isArray(preference.subCaste)) {
		preference.subCaste.forEach(subCaste => {
			mustFilters.push({
				bool: {
					should: createTermFilter('horoscope.subCaste.id', subCaste.id)
				}
			});
		});
	}

	// educationLevel - where to map?

	// familyFinancialBackground - family > financial background not a tag array
	// familyValue - family > family values not a tag array

	// specialCase
	if (!isEmpty(preference.specialCase) && isArray(preference.specialCase)) {
		preference.specialCase.forEach(spCase => {
			mustFilters.push({
				bool: {
					should: createTermFilter('specialCases.id', spCase.id)
				}
			});
		});
	}

	return {
		bool: {
			must: mustFilters
		}
	};
};
