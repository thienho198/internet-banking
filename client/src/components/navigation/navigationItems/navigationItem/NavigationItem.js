import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import classes from './NavigationItem.module.css';

const NavigationItem = (props) => {
	//#region constructor
	const { isHaveDropdown, dropdownData } = props;
	let history = useHistory();
	//#region events
	const onMenuClicked = ({ key }) => {
		const url = dropdownData.find((item) => item.name === key).url;
		console.log(url);
		console.log(props);
		// props.location.pathname = '';
		// props.history.location.pathname = '';
		history.push(url);
		// props.history.replace(url);
	};

	//#region render
	if (isHaveDropdown) {
		var menu = (
			<Menu onClick={onMenuClicked}>
				{dropdownData.map((item) => <Menu.Item key={item.name}>{item.name}</Menu.Item>)}
			</Menu>
		);
	}
	return isHaveDropdown ? (
		<li>
			<Dropdown overlay={menu}>
				<a
					className="ant-dropdown-link"
					onClick={(e) => e.preventDefault()}
					style={{ lineHeight: '56px', whiteSpace: 'nowrap' }}
				>
					{props.children} <DownOutlined />
				</a>
			</Dropdown>
		</li>
	) : (
		<li className={classes.navigationItem}>
			<NavLink to={props.link} exact={props.exact} activeClassName={classes.active}>
				{props.children}
			</NavLink>
		</li>
	);
};

export default NavigationItem;
