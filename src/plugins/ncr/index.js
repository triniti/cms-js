import Plugin from 'Plugin';
import reducer from 'plugins/ncr/reducers';

export default class NcrPlugin extends Plugin {
  constructor() {
    super('triniti', 'ncr');
  }

  async configure(app) {
    this.reducer = reducer;

    const dispatcher = app.getDispatcher();

    dispatcher.addListener('gdbots:ncr:mixin:get-node-request.enrich', (pbjxEvent) => {
      pbjxEvent.getMessage().set('consistent_read', true);
    });

    dispatcher.addListener('gdbots:ncr:command:update-node.enrich', (pbjxEvent) => {
      pbjxEvent.getMessage().clear('old_node');
    });
  }
}
