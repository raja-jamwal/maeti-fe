import * as config from './config.json';
import * as prodConfig from './prod.config.json';
import { ENV, getEnvironment } from '../utils/environment';

const getConfig = function(env = getEnvironment()): any {
	if (env === ENV.DEV) return config;
	if (env === ENV.STAGING || env === ENV.PROD) {
		return Object.assign({}, config, prodConfig);
	}
	return config;
};

export { getConfig };
