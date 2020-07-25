import { lazy } from 'react';

import { all_rights } from '../../util/RightUtil';

const History = lazy(() => import('./history/History'));
const ListReceiver = lazy(() => import('./listReceiver/ListReceiver'));
const ChangePassword = lazy(() => import('./changePassword/ChangePassword'));
const TransferInBank = lazy(() => import('./transfer/TranferInBank'));

export default [
	{ id: '/history-customer', exact: true, component: History, rights: [ all_rights.CUSTOMER_ACCESS ] },
	{ id: '/list-receiver', exact: true, component: ListReceiver, rights: [ all_rights.CUSTOMER_ACCESS ] },
	{ id: '/change-password-customer', exact: true, component: ChangePassword, rights: [ all_rights.CUSTOMER_ACCESS ] },
	{ id: '/transfer', exact: true, component: TransferInBank, rights: [ all_rights.CUSTOMER_ACCESS ] }
];
