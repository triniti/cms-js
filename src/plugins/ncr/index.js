/* eslint-disable no-unused-vars, class-methods-use-this */
import Plugin from '@triniti/app/Plugin';
import { formNames } from '@triniti/cms/plugins/news/constants';
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';

import ConsistentReadEnricher from './services/ConsistentReadEnricher';
import ExpirableSubscriber from './services/ExpirableSubscriber';
import LockableEnricher from './services/LockableEnricher';
import SluggableSubscriber from './services/SluggableSubscriber';
import PublishNodeValidator from './services/PublishNodeValidator';
import UpdateNodeEnricher from './services/UpdateNodeEnricher';
import pbjxReducer from './reducers/pbjx';
import reducer from './reducers';
import saga from './sagas';
import { serviceIds } from './constants';

export default class NcrPlugin extends Plugin {
  constructor() {
    super('triniti', 'ncr', '0.3.0');
  }

  configure(app, bottle) {
    this.reducer = reducer;
    this.saga = saga;

    bottle.factory(serviceIds.SLUGGABLE_FORMS, () => ({
      default: false,
      [formNames.CREATE_ARTICLE]: true,
      [formNames.ARTICLE]: true,
    }));
    bottle.service(
      serviceIds.SLUGGABLE_SUBSCRIBER,
      SluggableSubscriber,
      serviceIds.SLUGGABLE_FORMS,
    );
    bottle.service(serviceIds.CONSISTENT_READ_ENRICHER, ConsistentReadEnricher);
    bottle.service(serviceIds.EXPIRABLE_SUBSCRIBER, ExpirableSubscriber);
    bottle.service(serviceIds.LOCKABLE_ENRICHER, LockableEnricher);
    bottle.service(serviceIds.PUBLISH_NODE_VALIDATOR, PublishNodeValidator);
    bottle.service(serviceIds.UPDATE_NODE_ENRICHER, UpdateNodeEnricher);
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
      serviceIds.CONSISTENT_READ_ENRICHER,
      serviceIds.EXPIRABLE_SUBSCRIBER,
      serviceIds.LOCKABLE_ENRICHER,
      serviceIds.SLUGGABLE_SUBSCRIBER,
      serviceIds.PUBLISH_NODE_VALIDATOR,
      serviceIds.UPDATE_NODE_ENRICHER,
    ];
  }
}
