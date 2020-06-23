import React from 'react';
import { connect } from 'react-redux';

import NavigationItem from './navigationItem/NavigationItem';
import UserNavItem from './navigationItem/UserNavItem';
import classes from './NavigationItems.module.css';

const NavigationItems = (props) => {
	const { isAuthenticated, authData } = props;
	console.log(isAuthenticated);
	return (
		<ul className={classes.navigationItems}>
			<NavigationItem link="/" exact>
				Trang chủ
			</NavigationItem>
			{isAuthenticated ? authData.access === 'customer' ? (
				<React.Fragment>
					<NavigationItem link="/history-customer">Lịch Sử Giao Dịch</NavigationItem>
					<NavigationItem link="/transfer-customer">Chuyển Khoản</NavigationItem>
					<NavigationItem link="/remind">Quản Lý Nhắc Nợ</NavigationItem>
					<UserNavItem authData={props.authData} />
				</React.Fragment>
			) : authData.access === 'employee' ? (
				<React.Fragment>
					<NavigationItem link="/create-account">Tạo Tài Khoản</NavigationItem>
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
		authData: state.auth.authData
	};
};

export default connect(mapStateToProps)(NavigationItems);
