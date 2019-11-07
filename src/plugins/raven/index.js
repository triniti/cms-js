/* eslint-disable no-unused-vars, class-methods-use-this */
import mqtt from 'mqtt';
import Plugin from '@triniti/app/Plugin';
import { serviceIds as appServiceIds } from '@triniti/app/constants';
import { serviceIds as iamServiceIds } from '@triniti/cms/plugins/iam/constants';
import { serviceIds } from './constants';
import reducer from './reducers';
import routes from './routes';
import saga from './sagas';
import NodeChangeWatcher from './services/NodeChangeWatcher';
import Raven from './services/Raven';

export default class RavenPlugin extends Plugin {
  constructor() {
    super('triniti', 'raven', '0.2.7');
  }

  configure(app, bottle) {
    this.reducer = reducer;
    this.routes = routes;
    this.saga = saga;

    bottle.factory(serviceIds.MQTT, () => mqtt);
    bottle.service(serviceIds.NODE_CHANGE_WATCHER, NodeChangeWatcher);
    bottle.service(
      serviceIds.RAVEN,
      Raven,
      serviceIds.MQTT,
      appServiceIds.REDUX_STORE,
      iamServiceIds.API_ENDPOINT,
      'app_vendor',
      'app_name',
      'app_env',
    );
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.NODE_CHANGE_WATCHER,
    ];
  }
}
