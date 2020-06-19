import React from 'react';

import logo from '../../../asset/images/logog16.png';
import classes from './Toolbar.module.css';
import NavigationItems from '../navigationItems/NavigationItems';
export default function Toolbar(props) {
	const { isAuthenticated } = props;
	return (
		<header className={classes.toobar}>
			<div className={classes.logo}>
				<img src={logo} alt="logo" />
			</div>
			<NavigationItems />
		</header>
	);
}
