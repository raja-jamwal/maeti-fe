import { Pageable, UserProfile } from './account-defination';
import { createAction, handleActions } from 'redux-actions';

export interface IExploreState {
	search: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	discover: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	new_matches: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	reverse_matches: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	my_matches: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	mutual_matches: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	community_matches: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	location_matches: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	added_me: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	viewed_contact: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	viewed_profile: {
		profiles: {
			[profileId: number]: UserProfile;
		};
		fetching: boolean;
		pageable: Pageable;
	};
	selected_screen: string;
}

const defaultExploreState: IExploreState = {
	search: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	discover: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	new_matches: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	reverse_matches: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	my_matches: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	mutual_matches: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	community_matches: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	location_matches: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	added_me: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	viewed_contact: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	viewed_profile: {
		profiles: {},
		fetching: false,
		pageable: {
			last: false,
			totalPages: 0,
			number: -1,
			totalElements: 0
		}
	},
	selected_screen: 'discover'
};

enum ACTIONS {
	CHANGE_SELECTED_SCREEN = 'CHANGE_SELECTED_SCREEN'
}

export const changeSelectedExploreScreen = createAction<string>(ACTIONS.CHANGE_SELECTED_SCREEN);

export const exploreReducer = handleActions(
	{
		[ACTIONS.CHANGE_SELECTED_SCREEN]: (state, { payload }) => {
			const selected_screen = (payload as any) as string;
			return {
				...state,
				selected_screen
			};
		}
	},
	defaultExploreState
);
