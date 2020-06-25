import React from 'react';
import { lazy } from 'react';

import EmployeeRouter from './modules/employee/employee_router';
const Login = lazy(() => import('./modules/login/Login'));
const Home = lazy(() => import('./modules/home/Home'));
const NotFound = lazy(() => import('./modules/notFound/NotFound'));

export default [
	{ id: '/', component: Home, rights: [], exact: true },
	{ id: '/login', component: Login, rights: [], exact: true },
	...EmployeeRouter,
	{ id: '*', component: NotFound, rights: [] }
];
