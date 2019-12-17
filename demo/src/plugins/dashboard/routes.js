import { PLUGIN_PREFIX } from './constants';

const r = (id) => `${PLUGIN_PREFIX}${id}`;

const routes = {
  [r('dashboard')]: {
    path: '/dashboard/:tab(news|active)/',
    component: import('./screens/dashboard'),
  },
  [r('dashboardRedirect')]: {
    path: '/dashboard',
    redirect: {
      to: '/dashboard/news',
    },
  },
  [r('indexRedirect')]: {
    path: '/',
    redirect: {
      to: '/dashboard/news',
    },
  },
};

export default routes;
