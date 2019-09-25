import { routeIds } from './constants';

const routes = {
  [routeIds.FLAGSET]: {
    path: '/sys/flagsets/:node_id/:tab(details|history|raw)?/:mode(edit)?',
    component: import('./screens/flagset'),
  },
  [routeIds.LIST_ALL_FLAGSETS]: {
    path: '/sys/flagsets',
    component: import('./screens/list-all-flagsets'),
  },
  [routeIds.LIST_ALL_PICKLISTS]: {
    path: '/sys/picklists',
    component: import('./screens/list-all-picklists/index'),
  },
  [routeIds.PICKLIST]: {
    path: '/sys/picklists/:node_id/:tab(details|history|raw)?/:mode(edit)?',
    component: import('./screens/picklist'),
  },
  [routeIds.REDIRECT]: {
    path: '/sys/redirects/:node_id/:tab(details|history|raw)?/:mode(edit)?',
    component: import('./screens/redirect'),
  },
  [routeIds.SEARCH_REDIRECTS]: {
    path: '/sys/redirects',
    component: import('./screens/search-redirects'),
  },
  [routeIds.INDEX]: {
    path: '/sys',
    redirect: {
      to: '/sys/picklists',
    },
  },
};

export default routes;
