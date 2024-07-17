import Plugin from '@triniti/cms/Plugin.js';
import reducer from '@triniti/cms/plugins/ncr/reducers/index.js';
import { serviceIds } from '@triniti/cms/plugins/ncr/constants.js';

export default class NcrPlugin extends Plugin {
  constructor() {
    super('triniti', 'ncr');
  }

  async configure(app) {
    this.reducer = reducer;

    const dispatcher = app.getDispatcher();

    // todo: do we need to force everything to be consistent?
    dispatcher.addListener('gdbots:ncr:mixin:get-node-request.enrich', (pbjxEvent) => {
      //pbjxEvent.getMessage().set('consistent_read', true);
    });

    dispatcher.addListener('gdbots:ncr:command:update-node.enrich', (pbjxEvent) => {
      pbjxEvent.getMessage().clear('old_node');
    });

    app.register(serviceIds.PUBLISH_NODE_VALIDATOR, async () => {
      const PublishNodeValidator = (await import('@triniti/cms/plugins/ncr/PublishNodeValidator.js')).default;
      return new PublishNodeValidator(app);
    });

    app.subscribe('gdbots:ncr:command:publish-node.validate', serviceIds.PUBLISH_NODE_VALIDATOR, 'validate');
  }
}
