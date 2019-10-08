import { Text, View } from 'react-native';
import * as React from 'react';
import ChoiceFilter from './filters/ChoiceFilter';
import {
	BloodGroupOptions,
	BodyComplexionOptions,
	CreatedByOptions,
	MaritalStatusOptions,
	ProfileTableBodyTypeOptions,
	ProfileTableHeightOptions,
	ProfileTableLensesOptions,
	ProfileTableMotherTongueOptions
} from '../collapsible-table/profile-table';
import { getAllCountries } from 'react-native-country-picker-modal';
import { IRootState } from '../../store';
import { Tag } from '../../store/reducers/account-defination';
import {
	EducationTableEducationFieldOptions,
	EducationTableHighestEducationLevel,
	EducationTableMediumOfPrimaryEducationOptions
} from '../collapsible-table/education-table';
import {
	LifestyleTableDietOptions,
	LifestyleTableDrinkOptions,
	LifestyleTableHotelingOptions,
	LifestyleTablePartyingOptions,
	LifestyleTableSmokingOptions
} from '../collapsible-table/lifestyle-table';
import {
	ProfessionTableOccupationOptions,
	ProfessionTableWorkingFieldOptions
} from '../collapsible-table/profession-table';
import RangeFilter, { IRangeFilterProps } from './filters/RangeFilter';
import { CRORE_RUPEE, LAKH_RUPEE, yearsToTs } from '../../utils';

interface FilterProps {
	options: any;
}

const Filter = (props: FilterProps) => {
	return (
		<View>
			<Text>Filter Not Implemented</Text>
		</View>
	);
};

export interface FilterOption {
	hidden?: boolean;
	label: String;
	choices?: any;
	component: any;
	getSearchFilter?: (userSelections: any) => any;
	range?: IRangeFilterProps;
}

interface ITypesOfFilter {
	[key: string]: FilterOption;
}

function saneChoices(choices: any) {
	return (choices || []).filter((choice: any) => {
		return !!choice.value;
	});
}

export const TypesOfFilter: ITypesOfFilter = {
	/*
		UserProfile options
	 */
	martialStatus: {
		label: 'Marital Status',
		choices: saneChoices(MaritalStatusOptions),
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			// check if not-set is set
			// then?
			const queryBase = {
				bool: {
					should: Object.keys(userSelections)
						.filter(u => !!userSelections[u])
						.map(maritalKey => {
							return {
								term: {
									'maritalStatus.keyword': maritalKey
								}
							};
						})
				}
			};
			return queryBase;
		}
	},
	createdBy: {
		label: 'Created by',
		choices: CreatedByOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			// check if not-set is set
			// then?
			const queryBase = {
				terms: {
					'createdBy.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
			return queryBase;
		}
	},
	age: {
		label: 'Age',
		range: {
			from: 18,
			to: 60,
			defaultFrom: 20,
			defaultTo: 34,
			suffix: 'yrs'
		},
		component: RangeFilter,
		getSearchFilter: userSelections => {
			const currentTs = new Date().getTime() / 1000;
			const { from, to } = userSelections;
			const fromTs = Math.ceil(currentTs - yearsToTs(from || 0));
			const toTs = Math.floor(currentTs - yearsToTs(to || 0));
			return {
				range: {
					dob: {
						lte: fromTs,
						gte: toTs
					}
				}
			};
		}
	},
	// TODO: Convert height to range filter
	height: {
		label: 'Height',
		range: {
			from: 120,
			to: 214,
			defaultFrom: 120,
			defaultTo: 200,
			suffix: 'cms'
		},
		component: RangeFilter,
		getSearchFilter: userSelections => {
			const { from, to } = userSelections;
			return {
				range: {
					height: {
						lte: to,
						gte: from
					}
				}
			};
		}
	},
	bloodGroup: {
		label: 'Blood Group',
		choices: BloodGroupOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'bloodGroup.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	lenses: {
		label: 'Spect / Lenses',
		choices: ProfileTableLensesOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lenses.keyword': Object.keys(userSelections).filter(u => !!userSelections[u])
				}
			};
		}
	},
	bodyComplexion: {
		label: 'Complexion',
		choices: BodyComplexionOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'bodyComplexion.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	describeMyself: {
		label: 'Personal Values',
		choices: (store: IRootState) => {
			const descriptionTags = store.tags['description'] || [];
			return descriptionTags.map((description: Tag) => {
				return {
					label: description.value,
					value: description.value
				};
			});
		},
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'describeMyself.value.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	bodyType: {
		label: 'Body type',
		choices: ProfileTableBodyTypeOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'bodyType.keyword': Object.keys(userSelections).filter(u => !!userSelections[u])
				}
			};
		}
	},
	motherTongue: {
		label: 'Mother Tongue',
		choices: ProfileTableMotherTongueOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'motherTongue.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},

	/*
		Horoscope options
	 */
	caste: {
		label: 'Caste',
		choices: (store: IRootState) => {
			const casteTags = store.tags['caste'] || [];
			return casteTags.map((casteTag: Tag) => {
				return {
					label: casteTag.value,
					value: casteTag.value
				};
			});
		},
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'horoscope.caste.value.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	subCaste: {
		label: 'Sub Caste',
		choices: (store: IRootState) => {
			const subCasteTags = store.tags['sub_caste'] || [];
			return subCasteTags.map((subCasteTag: Tag) => {
				return {
					label: subCasteTag.value,
					value: subCasteTag.value
				};
			});
		},
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'horoscope.subCaste.value.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},

	/*
		Profession options
	 */

	occupation: {
		label: 'Occupation',
		choices: ProfessionTableOccupationOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'profession.occupation.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	workingField: {
		label: 'Working Field',
		choices: ProfessionTableWorkingFieldOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'profession.workingField.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	workCountry: {
		label: 'Work country',
		choices: getAllCountries().map(country => {
			return {
				label: country.name.common,
				value: country.callingCode
			};
		}),
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'profession.workCountry.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},

	/*
		String fields how do we want to provide options
		aggs from es?
	 */

	// range type filter
	income: {
		label: 'Income',
		range: {
			from: 0,
			to: 10 * CRORE_RUPEE,
			defaultFrom: 3 * LAKH_RUPEE,
			defaultTo: 30 * LAKH_RUPEE,
			prefix: '₹',
			suffix: ' Rupees / Year'
		},
		component: RangeFilter,
		getSearchFilter: userSelections => {
			const { from, to } = userSelections;
			const fromIncome = from || 0;
			const toIncome = to || 0;
			return {
				range: {
					'profession.annualIncome': {
						gte: fromIncome,
						lte: toIncome
					}
				}
			};
		}
	},

	/*
		Education options
	 */
	education: {
		label: 'Education Level',
		choices: EducationTableHighestEducationLevel,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'education.highestEducationLevel.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	educationField: {
		label: 'Education Field',
		choices: EducationTableEducationFieldOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'education.educationField.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	educationMedium: {
		label: 'Education Medium',
		choices: EducationTableMediumOfPrimaryEducationOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'education.mediumOfPrimaryEducation.keyword': Object.keys(
						userSelections
					).filter(u => !!userSelections[u])
				}
			};
		}
	},

	/*
		Personal investment options
	 */
	investments: {
		label: 'Investments',
		choices: (store: IRootState) => {
			const investmentsTags = store.tags['investment'] || [];
			return investmentsTags.map((investment: Tag) => {
				return {
					label: investment.value,
					value: investment.value
				};
			});
		},
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'investments.investments.value.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},

	/*
		Lifestyle options
	 */

	diet: {
		label: 'Diet',
		choices: LifestyleTableDietOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.diet.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	smoke: {
		label: 'Smoke',
		choices: LifestyleTableSmokingOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.smoking.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	drink: {
		label: 'Drink',
		choices: LifestyleTableDrinkOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.drinking.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	hoteling: {
		label: 'Hoteling',
		choices: LifestyleTableHotelingOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.hoteling.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	partying: {
		label: 'Partying',
		choices: LifestyleTablePartyingOptions,
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.partying.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	socialNetworking: {
		label: 'Social Networking',
		choices: (store: IRootState) => {
			const socialTags = store.tags['social'] || [];
			return socialTags.map((social: Tag) => {
				return {
					label: social.value,
					value: social.value
				};
			});
		},
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.socialNetworking.value.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	priorities: {
		label: 'Priorities',
		choices: (store: IRootState) => {
			const priorityTags = store.tags['priority'] || [];
			return priorityTags.map((priority: Tag) => {
				return {
					label: priority.value,
					value: priority.value
				};
			});
		},
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.priorities.value.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	hobbies: {
		label: 'Hobbies',
		choices: (store: IRootState) => {
			const hobbyTags = store.tags['hobby'] || [];
			return hobbyTags.map((hobby: Tag) => {
				return {
					label: hobby.value,
					value: hobby.value
				};
			});
		},
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.hobbies.value.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},
	sports: {
		label: 'Sports and Fitness',
		choices: (store: IRootState) => {
			const sportsTags = store.tags['sports'] || [];
			return sportsTags.map((sport: Tag) => {
				return {
					label: sport.value,
					value: sport.value
				};
			});
		},
		component: ChoiceFilter,
		getSearchFilter: userSelections => {
			return {
				terms: {
					'lifestyle.sports.value.keyword': Object.keys(userSelections).filter(
						u => !!userSelections[u]
					)
				}
			};
		}
	},

	/*
		Global Search
	 */
	search: {
		hidden: true,
		label: 'Global Search',
		component: Filter,
		getSearchFilter: text => {
			console.log('getSearchFilter ', text);
			return {
				query_string: {
					// Add more string fields here to search
					fields: ['fullName', 'about'],
					query: `*${text}*`
				}
			};
		}
	}

	/*
		Need to acertain which way we want to implement them
		or do we even want to?
	 */
	/*mangal: {
		label: 'Mangal',
		component: Filter
	},
	rashi: {
		label: 'Rashi',
		component: Filter
	},
	nadi: {
		label: 'Nadi',
		component: Filter
	},*/

	// TODO: revisit this later
	/*'sort-by': {
		label: 'Sort By',
		component: Filter
	}*/
};
