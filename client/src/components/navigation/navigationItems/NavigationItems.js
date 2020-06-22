import React from 'react';
import { connect } from 'react-redux';

import NavigationItem from './navigationItem/NavigationItem';
import UserNavItem from './navigationItem/UserNavItem';
import classes from './NavigationItems.module.css';

const NavigationItems = (props) => {
	const { isAuthenticated } = props;
	console.log(isAuthenticated);
	return (
		<ul className={classes.navigationItems}>
			<NavigationItem link="/" exact>
				Home
			</NavigationItem>
			{isAuthenticated ? <UserNavItem /> : <NavigationItem link="/login">Login</NavigationItem>}
		</ul>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.accessToken !== null
	};
};

export default connect(mapStateToProps)(NavigationItems);
