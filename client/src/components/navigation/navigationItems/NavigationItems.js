import React from 'react';

import NavigationItem from './navigationItem/NavigationItem';
import classes from './NavigationItems.module.css';

const NavigationItems = (props) => {
	const { isAuthenticated } = props;

	return (
		<ul className={classes.navigationItems}>
			<NavigationItem link="/" exact>
				Home
			</NavigationItem>
			{isAuthenticated ? (
				<NavigationItem link="/logout">Logout</NavigationItem>
			) : (
				<NavigationItem link="/login">Login</NavigationItem>
			)}
		</ul>
	);
};

export default NavigationItems;
