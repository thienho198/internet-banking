import { lazy } from 'react';

import { all_rights } from '../../util/RightUtil';
const CreateAccount = lazy(() => import('./createAccount/CreateAccount'));
const AddMoneyByStk = lazy(() => import('./addMoney/AddMoneyByStk'));
const AddMoneyByEmail = lazy(() => import('./addMoney/AddMoneyByEmail'));

export default [
	{
		id: '/create-account-customer',
		exact: true,
		component: CreateAccount,
		rights: [ all_rights.EMPLOYEE_ACCESS ]
	},
	{ id: '/add-money-by-stk', exact: true, component: AddMoneyByStk, rights: [ all_rights.EMPLOYEE_ACCESS ] },
	{ id: '/add-money-by-email', exact: true, component: AddMoneyByEmail, rights: [ all_rights.EMPLOYEE_ACCESS ] }
];
