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
		accessToken: data.accesstoken
	};
};

export const changeAccessToken = (accessToken) => {
	return {
		type: actionTypes.CHANGE_ACCESS_TOKEN,
		accessToken: accessToken
	};
};

export const authLogin = (data) => {
	return (dispatch) => {
		dispatch(authStart());
		axios
			.post('/auth/login', data)
			.then((result) => {
				console.log(result.data.refreshToken);
				myStorage.setItem('refreshToken', result.data.refreshToken);
				notification.success({
					message: 'Đăng nhập thành công',
					placement: 'bottom'
				});
				dispatch(authSuccess(result.data));
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
