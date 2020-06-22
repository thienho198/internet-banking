import axios from 'axios';
import authRefreshAxios from './authRefreshAxios';
import { store } from '../store/store';
import * as authActions from '../store/actions/auth';

const myStorage = window.localStorage;

const instance = axios.create({});

instance.interceptors.request.use((config) => {
	const state = store.getState();
	config.headers.common['x-access-token'] = state.auth.accessToken;
	return config;
});

const refresh = async (dataToken, resolve, reject, error) => {
	try {
		const { data } = await authRefreshAxios.post('/auth/refresh', dataToken);

		store.dispatch(authActions.changeAccessToken(data.accessToken));

		error.config.headers['x-access-token'] = data.accessToken;
		const response = await authRefreshAxios.request(error.config);

		resolve(response);
	} catch (err) {
		console.log('r343r');
		reject(err);
	}
};
instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return new Promise((resolve, reject) => {
			if (error.response.data.isLogin === true) reject(error);
			else if (error.response.status === 401 && error.config && !error.config.__isRetryRequest) {
				const dataToken = {
					refreshToken: myStorage.getItem('refreshToken'),
					accessToken: store.getState().auth.accessToken
				};
				console.log('aaa');
				refresh(dataToken, resolve, reject, error);
			} else {
				reject(error);
			}
		});
	}
);

export default instance;
