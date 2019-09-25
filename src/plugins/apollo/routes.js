import { routeIds } from './constants';

const routes = {
  [routeIds.SEARCH_POLLS]: {
    path: '/apollo/polls',
    component: import('./screens/search-polls'),
  },
  [routeIds.POLL]: {
    path: '/apollo/polls/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|taxonomy|history|raw)?/:mode(edit)?',
    component: import('./screens/poll/index'),
  },
  [routeIds.INDEX]: {
    path: '/apollo',
    redirect: {
      to: '/apollo/polls',
    },
  },
};

export default routes;
