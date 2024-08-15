import Plugin from '@triniti/cms/Plugin.js';
import { serviceIds } from '@triniti/cms/plugins/news/constants.js';

export default class NewsPlugin extends Plugin {
  constructor() {
    super('triniti', 'news');
  }

  async configure(app) {
    app.register(serviceIds.HEADLINE_FRAGMENTS_SUBSCRIBER, async () => {
      const HeadlineFragmentsSubscriber = (await import('@triniti/cms/plugins/news/HeadlineFragmentsSubscriber.js')).default;
      return new HeadlineFragmentsSubscriber();
    });

    app.subscribe('triniti:news:mixin:headline-fragments.init_form', serviceIds.HEADLINE_FRAGMENTS_SUBSCRIBER, 'initForm');
    app.subscribe('triniti:news:mixin:headline-fragments.validate', serviceIds.HEADLINE_FRAGMENTS_SUBSCRIBER, 'validate');
  }
}
