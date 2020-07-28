import { lazy } from 'react';

import { all_rights } from '../../util/RightUtil';

const ManageEmployee = lazy(() => import('./manageEmployee/ManageEmployee'));
const ExchangeHistory = lazy(() => import('./exchangeHistory/ExchangeHistory'));

export default [
    { id: '/manage-employee', exact: true, component: ManageEmployee, rights: [ all_rights.ADMIN_ACCESS ] },
    { id: '/history-exchange', exact: true, component: ExchangeHistory, rights: [ all_rights.ADMIN_ACCESS ] }
]