import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ApiRequest } from '../utils';
import { API } from '../config/API';
import { IRootState } from '../store/index';
import { getCurrentUserProfile } from '../store/reducers/self-profile-reducer';
import { markProfileAsUnBlocked } from '../store/reducers/user-profile-reducer';
import { connect } from 'react-redux';
import { UserProfile } from '../store/reducers/account-defination';
import { simplePrompt } from '../components/alert/index';
import { Dispatch, bindActionCreators } from 'redux';
import {
	SettingTitle,
	SettingDivider,
	SettingRow,
	SettingBlock
} from '../components/settings/settings';
import { noop } from 'lodash';
import { Throbber } from '../components/throbber/throbber';

const defaultProps = {
	navigation: null,
	currentUserProfile: null,
	unblockProfileFunc: noop
};

interface IPropType {
	navigation: any;
	currentUserProfile: UserProfile | null;
	unblockProfileFunc: (userProfile: UserProfile) => any;
}

function BlockedProfileList({
	navigation,
	currentUserProfile,
	unblockProfileFunc
}: IPropType = defaultProps) {
	if (!navigation || !currentUserProfile) return null;
	const [isFetching, setIsFetching] = React.useState(false);
	const [profilesList, setProfilesList] = React.useState([] as UserProfile[]);

	const fetchProfilesList = async () => {
		setIsFetching(true);
		try {
			await ApiRequest(API.BLOCK.LIST, { byUserProfileId: currentUserProfile.id }).then(
				profiles => setProfilesList(profiles as UserProfile[])
			);
		} finally {
			setIsFetching(false);
		}
	};

	React.useEffect(() => {
		if ((navigation as any).setParams) {
			(navigation as any).setParams({ title: 'Blocked Profiles' });
		}
		fetchProfilesList();
	}, []);

	const unblockProfile = (profile: UserProfile) => {
		simplePrompt('Unblock', `Unblock ${profile.fullName}`, async () => {
			await unblockProfileFunc(profile);
			await fetchProfilesList();
		});
	};

	return (
		<View style={styles.container}>
			<SettingTitle label={'Blocked profiles by you'} />

			{isFetching && <Throbber size="small" />}

			<SettingBlock>
				{profilesList.map(profile => (
					<View key={profile.fullName}>
						<SettingRow
							label={profile.fullName}
							action={() => unblockProfile(profile)}
						/>
						<SettingDivider />
					</View>
				))}
			</SettingBlock>
		</View>
	);
}

BlockedProfileList['navigationOptions'] = screenProps => ({
	title: 'Blocked Profiles'
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'rgb(229, 235, 240)'
	},
	title: {
		fontSize: 20
	}
});

const mapStateToProps = (state: IRootState) => {
	return {
		currentUserProfile: getCurrentUserProfile(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		unblockProfileFunc: bindActionCreators(markProfileAsUnBlocked, dispatch)
	};
};

export const BlockedProfileListScreen = connect(
	mapStateToProps,
	mapDispatchToProps
)(BlockedProfileList);
