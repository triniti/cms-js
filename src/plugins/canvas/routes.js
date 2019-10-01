import { routeIds } from './constants';

const routes = {
  [routeIds.SEARCH_PAGES]: {
    path: '/canvas/pages',
    component: import('./screens/search-pages'),
  },
  [routeIds.PAGE]: {
    path: '/canvas/pages/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|code|history|raw|seo|taxonomy)?/:mode(edit)?',
    component: import('./screens/page'),
  },
  [routeIds.INDEX]: {
    path: '/canvas',
    redirect: {
      to: '/canvas/pages',
    },
  },
};

export default routes;
