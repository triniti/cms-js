import { routeIds } from './constants';

const routes = {
  [routeIds.CATEGORY]: {
    path: '/taxonomy/categories/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|code|history|raw|seo)?/:mode(edit)?',
    component: import('./screens/category'),
  },
  [routeIds.INDEX]: {
    path: '/taxonomy',
    redirect: {
      to: '/taxonomy/categories',
    },
  },
  [routeIds.SEARCH_CATEGORIES]: {
    path: '/taxonomy/categories',
    component: import('./screens/search-categories'),
  },
  [routeIds.CHANNEL]: {
    path: '/taxonomy/channels/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|code|history|raw|seo)?/:mode(edit)?',
    component: import('./screens/channel'),
  },
  [routeIds.SEARCH_CHANNELS]: {
    path: '/taxonomy/channels',
    component: import('./screens/get-all-channels'),
  },
};

export default routes;
