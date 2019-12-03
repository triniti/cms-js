import Plugin from '@triniti/app/Plugin';

import PersonSubscriber from './services/PersonSubscriber';
import HasPeopleSubscriber from './services/HasPeopleSubscriber';
import routes from './routes';
import { serviceIds } from './constants';

/* eslint-disable class-methods-use-this */
export default class PeoplePlugin extends Plugin {
  constructor() {
    super('triniti', 'people', '0.2.11');
  }

  /* eslint-disable no-unused-vars */
  configure(app, bottle) {
    this.routes = routes;
    bottle.service(serviceIds.PERSON_SUBSCRIBER, PersonSubscriber);
    bottle.service(serviceIds.HAS_PEOPLE_SUBSCRIBER, HasPeopleSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.PERSON_SUBSCRIBER,
      serviceIds.HAS_PEOPLE_SUBSCRIBER,
    ];
  }
}
