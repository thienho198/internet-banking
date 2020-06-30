import { lazy } from 'react';

import { all_rights } from '../../util/RightUtil';

const History = lazy(() => import('./history/History'));

export default [ { id: '/history-customer', exact: true, component: History, rights: [ all_rights.CUSTOMER_ACCESS ] } ];
