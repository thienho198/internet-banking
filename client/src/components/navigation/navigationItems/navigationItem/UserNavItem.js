import React from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';

import * as authActions from '../../../../store/actions/auth';
import classes from './NavigationItem.module.css';
import { toastSuccess } from '../../../../util/AppUtil';

const UserNavItem = (props) => {
	//#region events
	const onMenuClicked = ({ key }) => {
		if (key === '0') {
			props.logout();
			toastSuccess('Đăng xuất thành công');
		}
	};
	//#region render
	const menu = (
		<Menu onClick={onMenuClicked}>
			<Menu.Item key="0">Đăng xuất</Menu.Item>
		</Menu>
	);

	return (
		<li>
			<Dropdown overlay={menu}>
				<a
					className="ant-dropdown-link"
					onClick={(e) => e.preventDefault()}
					style={{ lineHeight: '56px', whiteSpace: 'nowrap' }}
				>
					{props.authData.userName} <DownOutlined />
				</a>
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
