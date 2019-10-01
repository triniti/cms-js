import NotificationV1Mixin from '@triniti/schemas/triniti/notify/mixin/notification/NotificationV1Mixin';
import { routeIds } from './constants';

const notificationTypePattern = NotificationV1Mixin.findAll().map((schema) => schema.getCurie().getMessage()).join('|');

const routes = {
  [routeIds.NOTIFICATION]: {
    path: `/notify/notifications/:type(${notificationTypePattern})/:node_id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/:tab(details|history|raw)?/:mode(edit)?`,
    component: import('./screens/notification'),
  },
  [routeIds.SEARCH_NOTIFICATIONS]: {
    path: '/notify/notifications',
    component: import('./screens/search-notifications'),
  },
  [routeIds.INDEX]: {
    path: '/notify',
    redirect: {
      to: '/notify/notifications',
    },
  },
};

export default routes;
