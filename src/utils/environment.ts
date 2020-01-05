import Constants from 'expo-constants';

export enum ENV {
	DEV = 'dev',
	STAGING = 'staging',
	PROD = 'prod'
}

const getEnvironment = function(env = Constants.manifest.releaseChannel): ENV {
	if (__DEV__) return ENV.DEV;
	if (env === 'staging') return ENV.STAGING;
	if (env === 'prod') return ENV.PROD;
	return ENV.DEV;
};

export { getEnvironment };
