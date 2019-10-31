/* eslint-disable class-methods-use-this */
import Plugin from '@triniti/app/Plugin';
import AndroidNotificationSubscriber from './services/AndroidNotificationSubscriber';
import EmailNotificationSubscriber from './services/EmailNotificationSubscriber';
import IosNotificationSubscriber from './services/IosNotificationSubscriber';
import NotificationEnricher from './services/NotificationEnricher';
import NotificationSubscriber from './services/NotificationSubscriber';

import routes from './routes';
import { serviceIds } from './constants';

export default class NotifyPlugin extends Plugin {
  constructor() {
    super('triniti', 'notify', '0.2.3');
  }

  configure(app, bottle) {
    this.routes = routes;
    bottle.service(serviceIds.ANDROID_NOTIFICATION_SUBSCRIBER, AndroidNotificationSubscriber);
    bottle.service(serviceIds.EMAIL_NOTIFICATION_SUBSCRIBER, EmailNotificationSubscriber);
    bottle.service(serviceIds.IOS_NOTIFICATION_SUBSCRIBER, IosNotificationSubscriber);
    bottle.service(serviceIds.NOTIFICATION_ENRICHER, NotificationEnricher);
    bottle.service(serviceIds.NOTIFICATION_SUBSCRIBER, NotificationSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.ANDROID_NOTIFICATION_SUBSCRIBER,
      serviceIds.EMAIL_NOTIFICATION_SUBSCRIBER,
      serviceIds.IOS_NOTIFICATION_SUBSCRIBER,
      serviceIds.NOTIFICATION_ENRICHER,
      serviceIds.NOTIFICATION_SUBSCRIBER,
    ];
  }
}
