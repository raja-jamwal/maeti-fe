const getTime = () => {
	const today = new Date();
	return today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
};

export const getLogger = (func: any) => {
	if (typeof func !== 'function') {
		console.warn('Developer pass in a class or function');
	}

	const className = func.name;
	return {
		log: (...args: any) => {
			const log = [`[${getTime()} ${className}]`].concat(args);
			console.log.apply(null, log as any);
		}
	};
};
