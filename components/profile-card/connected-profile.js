import React from 'react';
import ProfileCard from './index';
import AccountFixture from '../../fixtures/account.json';

const ConnectedProfile = props => <ProfileCard {...AccountFixture} {...props} />;
export default ConnectedProfile;
