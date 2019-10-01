import { PLUGIN_PREFIX } from './constants';

const r = (id) => `${PLUGIN_PREFIX}${id}`;

const routes = {
  [r('dashboard')]: {
    path: '/dashboard',
    component: import('./screens/dashboard'),
  },
  [r('indexRedirect')]: {
    path: '/',
    redirect: {
      to: '/dashboard',
    },
  },
};

export default routes;
