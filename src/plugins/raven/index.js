/* eslint-disable no-unused-vars, class-methods-use-this */
import Plugin from 'Plugin';
import { serviceIds } from 'plugins/raven/constants';
import reducer from 'plugins/raven/reducers';
import saga from 'plugins/raven/sagas';
// import NodeChangeWatcher from './services/NodeChangeWatcher';
// import Raven from './services/Raven';

export default class RavenPlugin extends Plugin {
  constructor() {
    super('triniti', 'raven');
  }

  async configure(app) {
    this.reducer = reducer;
    this.saga = saga;
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