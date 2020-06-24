import React from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import * as authActions from '../../../../store/actions/auth';
import classes from './NavigationItem.module.css';
import { toastSuccess } from '../../../../util/AppUtil';

const UserNavItem = (props) => {
	console.log('props', props);
	const menu = (
		<Menu>
			<Menu.Item key="0">
				<button
					onClick={() => {
						//remove accessToken in store
						props.logout();
						toastSuccess('Đăng xuất thành công');
						//remove refreshToken in local
					}}
				>
					Đăng xuất
				</button>
			</Menu.Item>
		</Menu>
	);
	//#region render
	return (
		<li style={{ width: '-webkit-fill-available' }}>
			<Dropdown overlay={menu} trigger={[ 'click' ]}>
				<a className="ant-dropdown-link" onClick={(e) => e.preventDefault()} style={{ lineHeight: '56px' }}>
					{props.authData.userName} <DownOutlined />
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

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => dispatch(authActions.authLogout())
	};
};
export default connect(null, mapDispatchToProps)(UserNavItem);
