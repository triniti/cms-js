/* eslint-disable class-methods-use-this */
import Plugin from '@triniti/app/Plugin';
import KalturaEntrySubscriber from './services/KalturaEntrySubscriber';
import VideoSubscriber from './services/VideoSubscriber';
import routes from './routes';
import { serviceIds } from './constants';

export default class OvpPlugin extends Plugin {
  constructor() {
    super('triniti', 'ovp', '0.2.5');
  }

  configure(app, bottle) {
    this.routes = routes;

    bottle.service(serviceIds.KALTURA_ENTRY_SUBSCRIBER, KalturaEntrySubscriber);
    bottle.service(serviceIds.VIDEO_SUBSCRIBER, VideoSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.KALTURA_ENTRY_SUBSCRIBER,
      serviceIds.VIDEO_SUBSCRIBER,
    ];
  }
}
