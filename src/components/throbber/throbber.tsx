import * as React from 'react';
import Colors from '../../constants/Colors';
import { ActivityIndicator } from 'react-native';

export const Throbber = () => <ActivityIndicator size="large" color={Colors.primaryDarkColor} />;
