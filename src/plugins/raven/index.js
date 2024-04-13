/* eslint-disable no-unused-vars, class-methods-use-this */
import Plugin from '@triniti/cms/Plugin';
import { serviceIds } from '@triniti/cms/plugins/raven/constants';
import reducer from '@triniti/cms/plugins/raven/reducers';
import saga from '@triniti/cms/plugins/raven/sagas';

export default class RavenPlugin extends Plugin {
  constructor() {
    super('triniti', 'raven');
  }

  async configure(app) {
    this.reducer = reducer;
    this.saga = saga;
    
    app.register(serviceIds.NODE_CHANGE_WATCHER, async () => {
      const NodeChangeWatcher = (await import('@triniti/cms/plugins/raven/services/NodeChangeWatcher')).default;
      return new NodeChangeWatcher(app);
    });

    app.subscribe('gdbots:ncr:mixin:node-updated.raven', serviceIds.NODE_CHANGE_WATCHER, 'forceRefresh');
    app.subscribe('gdbots:ncr:event:node-updated.raven', serviceIds.NODE_CHANGE_WATCHER, 'forceRefresh'); // Future proof vodka
  }

}