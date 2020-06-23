import React from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';

import Layout from './layout/Layout';
import Login from './modules/login/Login';

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}
	//#region render
	render() {
		const routes = (
			<Switch>
				<Route path="/" exact>
					This is Home
				</Route>
				<Route path="/login" exact component={Login} />
				<Route path="*">Not found</Route>
			</Switch>
		);
		return <Layout>{routes}</Layout>;
	}
}
