import Plugin from '@triniti/app/Plugin';
import routes from './routes';
import HasBlocksSubscriber from './services/HasBlocksSubscriber';
import PageSubscriber from './services/PageSubscriber';
import { serviceIds } from './constants';

export default class CanvasPlugin extends Plugin {
  constructor() {
    super('triniti', 'canvas', '0.2.7');
  }

  configure(app, bottle) {
    this.routes = routes;

    bottle.factory(serviceIds.LAYOUTS, () => ([
      {
        label: 'Content Only (no NAV, header or footer)',
        value: 'content-only',
      },
      {
        label: 'One Column',
        value: 'one-column',
      },
      {
        label: 'Two Column',
        value: 'two-column',
      },
      {
        label: 'None (no HTML wrapper)',
        value: 'none',
      },
    ]));
    bottle.service(serviceIds.HAS_BLOCKS_SUBSCRIBER, HasBlocksSubscriber);
    bottle.service(serviceIds.PAGE_SUBSCRIBER, PageSubscriber, serviceIds.LAYOUTS);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.HAS_BLOCKS_SUBSCRIBER,
      serviceIds.PAGE_SUBSCRIBER,
    ];
  }
}
