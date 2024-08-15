import Plugin from '@triniti/cms/Plugin.js';
import { serviceIds } from '@triniti/cms/plugins/canvas/constants.js';

export default class CanvasPlugin extends Plugin {
  constructor() {
    super('triniti', 'canvas');
  }

  async configure(app) {
    app.register(serviceIds.BLOCK_SUBSCRIBER, async () => {
      const BlockSubscriber = (await import('@triniti/cms/plugins/canvas/BlockSubscriber.js')).default;
      return new BlockSubscriber();
    });

    app.subscribe('triniti:canvas:mixin:block.init_form', serviceIds.BLOCK_SUBSCRIBER, 'initForm');
  }
}
