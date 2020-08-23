import axios from '../../axios/mainAxios';
import { notification } from 'antd';
//import axios from 'axios';

import * as actionTypes from './actionTypes';

const myStorage = window.localStorage;
export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};

export const authFaild = () => {
	return {
		type: actionTypes.AUTH_FAIL
	};
};

export const authSuccess = (data) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		accessToken: data.accesstoken,
		authData: {
			userName: data.name,
			stk: data.stk,
			email: data.email
		},
		access: data.userAccess
	};
};

export const changeAccessToken = (accessToken) => {
	return {
		type: actionTypes.CHANGE_ACCESS_TOKEN,
		accessToken: accessToken
	};
};

export const authLogout = () => {
	myStorage.setItem('refreshToken', null);
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

export const authLogin = (data, history) => {
	return (dispatch) => {
		dispatch(authStart());

		axios
			.post('/auth/login', data)
			.then((result) => {
				myStorage.setItem('refreshToken', result.data.refreshToken);

				notification.success({
					message: 'Đăng nhập thành công',
					placement: 'bottom'
				});
				dispatch(authSuccess(result.data));
				if (result.data.userAccess === 'customer') {
					history.push('/transfer-customer');
				}
				if (result.data.userAccess === 'admin') {
					history.push('/history-exchange');
				}
				if (result.data.userAccess === 'employee') {
					history.push('/create-account-customer');
				}
			})
			.catch((err) => {
				notification.error({
					message: 'Đăng nhập không thành công',
					description: 'Email hoặc mật khẩu không chính xác',
					placement: 'bottom'
				});
				dispatch(authFaild());
				console.log(err);
			});
	};
};
