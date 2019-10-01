import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(ArticleV1Mixin, 'command', 'delete-article'),
  getNodeRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-request'),
  markNodeAsDraft: resolveSchema(ArticleV1Mixin, 'command', 'mark-article-as-draft'),
  nodeDeleted: resolveSchema(ArticleV1Mixin, 'event', 'article-deleted'),
  nodeMarkedAsDraft: resolveSchema(ArticleV1Mixin, 'event', 'article-marked-as-draft'),
  nodePublished: resolveSchema(ArticleV1Mixin, 'event', 'article-published'),
  publishNode: resolveSchema(ArticleV1Mixin, 'command', 'publish-article'),
  searchNodes: SearchArticlesRequestV1Mixin.findOne(),
};
