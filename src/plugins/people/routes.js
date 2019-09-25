import { routeIds } from './constants';

const routes = {
  [routeIds.SEARCH_PEOPLE]: {
    path: '/people/people',
    component: import('./screens/search-people'),
  },
  [routeIds.PERSON]: {
    path: '/people/people/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|seo|taxonomy|history|raw)?/:mode(edit)?',
    component: import('./screens/person'),
  },
  [routeIds.INDEX]: {
    path: '/people/people',
  },
};

export default routes;
