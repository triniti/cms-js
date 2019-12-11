import Plugin from '@triniti/app/Plugin';
import { serviceIds } from './constants';
import SponsorableSubscriber from './services/SponsorableSubscriber';
import SponsorSubscriber from './services/SponsorSubscriber';
import routes from './routes';

export default class BoostPlugin extends Plugin {
  constructor() {
    super('triniti', 'boost', '0.2.16');
  }

  configure(app, bottle) {
    this.routes = routes;

    bottle.service(serviceIds.SPONSORABLE_SUBSCRIBER, SponsorableSubscriber);
    bottle.service(serviceIds.SPONSOR_SUBSCRIBER, SponsorSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.SPONSORABLE_SUBSCRIBER,
      serviceIds.SPONSOR_SUBSCRIBER,
    ];
  }
}
