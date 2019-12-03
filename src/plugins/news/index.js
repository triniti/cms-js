import Plugin from '@triniti/app/Plugin';
import { serviceIds } from './constants';
import routes from './routes';
import ArticleSubscriber from './services/ArticleSubscriber';
import HeadlineFragmentsSubscriber from './services/HeadlineFragmentsSubscriber';

export default class NewsPlugin extends Plugin {
  constructor() {
    super('triniti', 'news', '0.2.11');
  }

  configure(app, bottle) {
    this.routes = routes;

    bottle.service(serviceIds.ARTICLE_SUBSCRIBER, ArticleSubscriber);
    bottle.service(serviceIds.HEADLINE_FRAGMENTS_SUBSCRIBER, HeadlineFragmentsSubscriber);
  }

  /**
   * @returns {string[]}
   */
  getSubscriberServices() {
    return [
      serviceIds.ARTICLE_SUBSCRIBER,
      serviceIds.HEADLINE_FRAGMENTS_SUBSCRIBER,
    ];
  }
}
