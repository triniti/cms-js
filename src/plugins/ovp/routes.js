import { routeIds } from './constants';

const routes = {
  [routeIds.SEARCH_VIDEOS]: {
    path: '/ovp/videos',
    component: import('./screens/search-videos'),
  },
  [routeIds.VIDEO]: {
    path: '/ovp/videos/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|history|media|raw|seo|taxonomy)?/:mode(edit)?',
    component: import('./screens/video'),
  },
  [routeIds.INDEX]: {
    path: '/ovp',
    redirect: {
      to: '/ovp/videos',
    },
  },
};

export default routes;
