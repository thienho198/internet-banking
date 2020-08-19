import axios from 'axios';

import { store } from '../store/store';

const instance = axios.create({ timeout: 100000 });

instance.interceptors.request.use((config) => {
	const state = store.getState();
	config.headers.common['x-access-token'] = state.auth.accessToken;
	return config;
});

export default instance;
