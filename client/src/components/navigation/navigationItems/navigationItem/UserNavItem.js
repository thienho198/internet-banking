import React from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import classes from './NavigationItem.module.css';

const UserNavItem = (props) => {
	const menu = (
		<Menu>
			<Menu.Item key="0">
				<button
					onClick={() => {
						//remove accessToken in store
						//remove refreshToken in local
					}}
				>
					Logout
				</button>
			</Menu.Item>
		</Menu>
	);
	//#region render
	return (
		<li style={{ width: '-webkit-fill-available' }}>
			<Dropdown overlay={menu} trigger={[ 'click' ]}>
				<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} style={{ lineHeight: '56px' }}>
					Thienho <DownOutlined />
				</a>
				{/* <a>
				<div style={{ display: 'inline-block' }}>Thienho</div>
				<div style={{ display: 'inline-block' }}>
					<DownOutlined />
				</div>
			</a> */}
			</Dropdown>
		</li>
	);
};

export default UserNavItem;
