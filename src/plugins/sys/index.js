import Plugin from '@triniti/app/Plugin';
import { serviceIds as pbjxServiceIds } from '@gdbots/pbjx/constants';
import FlagsetSubscriber from './services/FlagsetSubscriber';
import PicklistSubscriber from './services/PicklistSubscriber';
import RedirectSubscriber from './services/RedirectSubscriber';
import pbjxReducer from './reducers/pbjx';
import routes from './routes';
import VanityUrlableSubscriber from './services/VanityUrlableSubscriber';
import { serviceIds } from './constants';

export default class SysPlugin extends Plugin {
  constructor() {
    super('triniti', 'sys', '0.6.3');
  }

  configure(app, bottle) {
    this.routes = routes;

    bottle.service(serviceIds.FLAGSET_SUBSCRIBER, FlagsetSubscriber);
    bottle.service(serviceIds.PICKLIST_SUBSCRIBER, PicklistSubscriber);
    bottle.service(serviceIds.REDIRECT_SUBSCRIBER, RedirectSubscriber);
    bottle.service(serviceIds.VANITY_URLABLE_SUBSCRIBER, VanityUrlableSubscriber);
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
      serviceIds.FLAGSET_SUBSCRIBER,
      serviceIds.PICKLIST_SUBSCRIBER,
      serviceIds.REDIRECT_SUBSCRIBER,
      serviceIds.VANITY_URLABLE_SUBSCRIBER,
    ];
  }
}
