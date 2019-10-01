import { Spinner } from '@triniti/admin-ui-plugin/components';
import { routeIds } from './constants';

const routes = {
  [routeIds.SEARCH_ARTICLES]: {
    path: '/news/articles',
    component: import('./screens/search-articles'),
  },
  [routeIds.ARTICLE]: {
    path: '/news/articles/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(story|details|taxonomy|seo|media|notifications|history|raw)?/:mode(edit)?',
    component: import('./screens/article'),
    async: { loadingTransition: false, loading: Spinner },
  },
  [routeIds.INDEX]: {
    path: '/news',
    redirect: {
      to: '/news/articles',
    },
  },
};

export default routes;
