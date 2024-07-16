import Plugin from '@triniti/cms/Plugin.js';
import { serviceIds } from '@triniti/cms/plugins/raven/constants.js';
import reducer from '@triniti/cms/plugins/raven/reducers/index.js';
import saga from '@triniti/cms/plugins/raven/sagas/index.js';

export default class RavenPlugin extends Plugin {
  constructor() {
    super('triniti', 'raven');
  }

  /*
  async configure(app) {
    this.reducer = reducer;
    this.saga = saga;

    app.register(serviceIds.NODE_CHANGE_WATCHER, async () => {
      const NodeChangeWatcher = (await import('@triniti/cms/plugins/raven/services/NodeChangeWatcher.js')).default;
      return new NodeChangeWatcher(app);
    });

    app.subscribe('gdbots:ncr:mixin:node-updated.raven', serviceIds.NODE_CHANGE_WATCHER, 'forceRefresh');
    app.subscribe('gdbots:ncr:event:node-updated.raven', serviceIds.NODE_CHANGE_WATCHER, 'forceRefresh'); // Future proof vodka
  }
  */
}
