import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import EventSubscriber from '@gdbots/pbjx/EventSubscriber';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default class LockableEnricher extends EventSubscriber {
  constructor() {
    super();
    this.enrichSearchArticles = this.enrichSearchArticles.bind(this);
  }

  enrichSearchArticles(event) {
    const message = event.getMessage();
    const canUnlock = isGranted(event.getRedux().getState(), `${resolveSchema(ArticleV1Mixin, 'command', 'unlock-article').getCurie()}`);
    if (!canUnlock) {
      message.set('is_locked', 2);
    }
  }

  getSubscribedEvents() {
    return {
      'triniti:news:mixin:search-articles-request.enrich': this.enrichSearchArticles,
    };
  }
}
