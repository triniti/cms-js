import AppV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/app/AppV1Mixin';
import { routeIds } from './constants';
import LoginScreen from './screens/login';

const appTypePattern = AppV1Mixin.findAll().map((schema) => schema.getCurie().getMessage()).join('|');

const routes = {
  [routeIds.LOGIN]: {
    path: '/login/:temp(temp)?',
    component: LoginScreen,
    eager: true,
    public: true,
  },
  [routeIds.APP]: {
    path: `/iam/apps/:type(${appTypePattern})/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|roles|history|raw)?/:mode(edit)?`,
    component: import('./screens/app'),
  },
  [routeIds.SEARCH_APPS]: {
    path: '/iam/apps',
    component: import('./screens/list-all-apps'),
  },
  [routeIds.SEARCH_USERS]: {
    path: '/iam/users',
    component: import('./screens/search-users'),
  },
  [routeIds.USER]: {
    path: '/iam/users/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|history|raw|roles)?/:mode(edit)?',
    component: import('./screens/user'),
  },
  [routeIds.SEARCH_ROLES]: {
    path: '/iam/roles',
    component: import('./screens/list-all-roles'),
  },
  [routeIds.ROLE]: {
    path: '/iam/roles/:node_id/:tab(details|history|raw)?/:mode(edit)?',
    component: import('./screens/role'),
  },
  [routeIds.INDEX]: {
    path: '/iam',
    redirect: {
      to: '/iam/users',
    },
  },
};

export default routes;
