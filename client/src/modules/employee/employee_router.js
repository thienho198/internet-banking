import { lazy } from 'react';

import { all_rights } from '../../util/RightUtil';
const CreateAccount = lazy(() => import('./createAccount/CreateAccount'));

export default [
	{ id: '/create-account/customer', exact: true, component: CreateAccount, rights: [ all_rights.EMPLOYEE_ACCESS ] }
];
