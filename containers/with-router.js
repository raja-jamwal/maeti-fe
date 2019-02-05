// HOC binds to a router navigation and passes to child
import React from 'react';

const withRouter = (navigator, Component) => {
	const router = navigator;
	console.warn(router);
	return props => {
		return <Component {...props} router={router} />;
	};
};

export { withRouter };
