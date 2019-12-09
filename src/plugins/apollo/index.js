import Plugin from '@triniti/app/Plugin';
import { serviceIds } from './constants';
import PollSubscriber from './services/PollSubscriber';
import HasPollSubscriber from './services/HasPollSubscriber';
import routes from './routes';

export default class ApolloPlugin extends Plugin {
  constructor() {
    super('triniti', 'apollo', '0.2.15');
  }

  configure(app, bottle) {
    this.routes = routes;

    bottle.service(serviceIds.POLL_SUBSCRIBER, PollSubscriber);
    bottle.service(serviceIds.HAS_POLL_SUBSCRIBER, HasPollSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.POLL_SUBSCRIBER,
      serviceIds.HAS_POLL_SUBSCRIBER,
    ];
  }
}
