import { routeIds } from './constants';

const routes = {
  [routeIds.SEARCH_SPONSORS]: {
    path: '/boost/sponsors',
    component: import('./screens/search-sponsors'),
  },
  [routeIds.SPONSOR]: {
    path: '/boost/sponsors/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|history|raw)?/:mode(edit)?',
    component: import('./screens/sponsor'),
  },
  [routeIds.INDEX]: {
    path: '/boost',
    redirect: {
      to: '/boost/sponsors',
    },
  },
};

export default routes;
