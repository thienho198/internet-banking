import React from 'react';
import { connect } from 'react-redux';

import NavigationItem from './navigationItem/NavigationItem';
import UserNavItem from './navigationItem/UserNavItem';
import classes from './NavigationItems.module.css';

const NavigationItems = (props) => {
	const { isAuthenticated, authData, access } = props;
	console.log(isAuthenticated);
	return (
		<ul className={classes.navigationItems}>
			<NavigationItem link="/" exact>
				Trang chủ
			</NavigationItem>
			{isAuthenticated ? access === 'customer' ? (
				<React.Fragment>
					<NavigationItem link="/history-customer">Lịch Sử Giao Dịch</NavigationItem>
					<NavigationItem link="/transfer-customer">Chuyển Khoản</NavigationItem>
					<NavigationItem link="/remind">Quản Lý Nhắc Nợ</NavigationItem>
					<UserNavItem authData={props.authData} />
				</React.Fragment>
			) : access === 'employee' ? (
				<React.Fragment>
					<NavigationItem link="/create-account/customer">Tạo Tài Khoản</NavigationItem>
					<NavigationItem link="/add-money">Nạp Tiền</NavigationItem>
					<NavigationItem link="/history-admin">Lịch sử giao dịch</NavigationItem>
					<UserNavItem authData={props.authData} />
				</React.Fragment>
			) : (
				<React.Fragment>
					<NavigationItem link="/manage-employee">Quản Lý Nhân Viên</NavigationItem>
					<NavigationItem link="/transfer-admin">Giao dịch</NavigationItem>
					<UserNavItem authData={props.authData} />
				</React.Fragment>
			) : (
				<NavigationItem link="/login">Đăng nhập</NavigationItem>
			)}
		</ul>
	);
};

const mapStateToProps = (state) => {
	return {
		isAuthenticated: state.auth.accessToken !== null,
		authData: state.auth.authData,
		access: state.auth.access
	};
};

export default connect(mapStateToProps)(NavigationItems);
