const getTime = () => {
	const today = new Date();
	return today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
};

export const getLogger = (func: any) => {
	const className = typeof func === 'function' ? func.name : func;
	return {
		log: (...args: any) => {
			const log = [`[${getTime()} ${className}]`].concat(args);
			console.log.apply(null, log as any);
		}
	};
};
