import React from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.css';
import Toolbar from '../components/navigation/toolbar/Toolbar';

class Layout extends React.Component {
	//#region constructor
	constructor(props) {
		super(props);
	}
	//#region render
	render() {
		return (
			<React.Fragment>
				<Toolbar isAuthenticated={this.props.isAuthenticated} />
				<main className={classes.mainContent}>{this.props.children}</main>
			</React.Fragment>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

export default connect(mapStateToProps)(Layout);
