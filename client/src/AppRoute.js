import React, { Suspense } from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from 'react-router-dom';

import routes from './routes';
import { checkRight } from './util/RightUtil';
import Loading from './components/loading/Loading';

const AppRoute = ({ userRights }) => {
	//bulid routes
	const filterRoutes = routes.filter((route) => checkRight(route.rights, userRights));

	return (
		<Suspense fallback={Loading}>
			<Switch>
				{filterRoutes.map((route) => <Route path={route.id} component={route.component} exact={route.exact} />)}
			</Switch>
		</Suspense>
	);
};

const mapStateToProps = (state) => {
	return {
		userRights: state.auth.access
	};
};

export default connect(mapStateToProps)(AppRoute);
