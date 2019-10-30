/* eslint-disable no-unused-vars, class-methods-use-this */
import Plugin from '@triniti/app/Plugin';
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';
import CategorizableSubscriber from './services/CategorizableSubscriber';
import CategorySubscriber from './services/CategorySubscriber';
import ChannelSubscriber from './services/ChannelSubscriber';
import HasChannelSubscriber from './services/HasChannelSubscriber';
import HashtaggableSubscriber from './services/HashtaggableSubscriber';
import pbjxReducer from './reducers/pbjx';
import routes from './routes';
import { serviceIds } from './constants';

export default class TaxonomyPlugin extends Plugin {
  constructor() {
    super('triniti', 'taxonomy', '0.2.2');
  }

  configure(app, bottle) {
    this.routes = routes;
    bottle.service(serviceIds.CATEGORIZABLE_SUBSCRIBER, CategorizableSubscriber);
    bottle.service(serviceIds.CATEGORY_SUBSCRIBER, CategorySubscriber);
    bottle.service(serviceIds.CHANNEL_SUBSCRIBER, ChannelSubscriber);
    bottle.service(serviceIds.HAS_CHANNEL_SUBSCRIBER, HasChannelSubscriber);
    bottle.service(serviceIds.HASHTAGGABLE_SUBSCRIBER, HashtaggableSubscriber);
  }

  start(app) {
    const container = app.getContainer();
    pbjxReducer(container.get(pbjxServiceIds.REDUX_REDUCER));
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.CATEGORIZABLE_SUBSCRIBER,
      serviceIds.CATEGORY_SUBSCRIBER,
      serviceIds.CHANNEL_SUBSCRIBER,
      serviceIds.HAS_CHANNEL_SUBSCRIBER,
      serviceIds.HASHTAGGABLE_SUBSCRIBER,
    ];
  }
}
