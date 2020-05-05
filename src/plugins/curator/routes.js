import { Spinner } from '@triniti/admin-ui-plugin/components';
import TeaserV1Mixin from '@triniti/schemas/triniti/curator/mixin/teaser/TeaserV1Mixin';
import WidgetV1Mixin from '@triniti/schemas/triniti/curator/mixin/widget/WidgetV1Mixin';
import { routeIds } from './constants';

const teaserTypePattern = TeaserV1Mixin.findAll().map((schema) => schema.getCurie().getMessage()).join('|');
const widgetTypePattern = WidgetV1Mixin.findAll().map((schema) => schema.getCurie().getMessage()).join('|');

const routes = {
  [routeIds.GALLERY]: {
    path: '/curator/galleries/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(story|details|code|taxonomy|seo|media|notifications|history|raw)?/:mode(edit)?',
    component: import('./screens/gallery'),
    async: { loadingTransition: false, loading: Spinner },
  },
  [routeIds.TEASER]: {
    path: `/curator/teasers/:type(${teaserTypePattern})/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|taxonomy|seo|history|raw)?/:mode(edit)?`,
    component: import('./screens/teaser'),
  },
  [routeIds.TIMELINE]: {
    path: '/curator/timelines/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|code|seo|history|raw|taxonomy)?/:mode(edit)?',
    component: import('./screens/timeline'),
  },
  [routeIds.WIDGET]: {
    path: `/curator/widgets/:type(${widgetTypePattern})/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|data-source|code|history|raw)?/:mode(edit)?`,
    component: import('./screens/widget'),
  },
  [routeIds.PROMOTION]: {
    path: '/curator/promotions/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|schedule|code|history|raw)?/:mode(edit)?',
    component: import('./screens/promotion'),
  },
  [routeIds.INDEX]: {
    path: '/curator',
    redirect: {
      to: '/curator/teasers',
    },
  },
  [routeIds.SEARCH_GALLERIES]: {
    path: '/curator/galleries',
    component: import('./screens/search-galleries'),
  },
  [routeIds.SEARCH_TEASERS]: {
    path: '/curator/teasers',
    component: import('./screens/search-teasers'),
  },
  [routeIds.SEARCH_TIMELINES]: {
    path: '/curator/timelines',
    component: import('./screens/search-timelines'),
  },
  [routeIds.SEARCH_WIDGETS]: {
    path: '/curator/widgets',
    component: import('./screens/search-widgets'),
  },
  [routeIds.SEARCH_PROMOTIONS]: {
    path: '/curator/promotions',
    component: import('./screens/search-promotions'),
  },
};

export default routes;
