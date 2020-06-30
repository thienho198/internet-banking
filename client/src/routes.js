import React from 'react';
import { lazy } from 'react';

import EmployeeRouter from './modules/employee/employee_router';
import CustomerRouter from './modules/customer/customer_router';
const Login = lazy(() => import('./modules/login/Login'));
const Home = lazy(() => import('./modules/home/Home'));
const NotFound = lazy(() => import('./modules/notFound/NotFound'));
const ForgotPassword = lazy(() => import('./modules/forgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./modules/forgotPassword/ResetPassword'));

export default [
	{ id: '/', component: Home, rights: [], exact: true },
	{ id: '/login', component: Login, rights: [], exact: true },
	{ id: '/forgot-password', component: ForgotPassword, rights: [], exact: true },
	{ id: '/auth/resetpassword/:token', component: ResetPassword, rights: [], exact: true },
	...CustomerRouter,
	...EmployeeRouter,
	{ id: '*', component: NotFound, rights: [] }
];
