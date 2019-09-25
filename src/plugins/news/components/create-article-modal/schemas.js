import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';

export default {
  node: ArticleV1Mixin.findOne(),
  nodeCreated: resolveSchema(ArticleV1Mixin, 'event', 'article-created'),
  createNode: resolveSchema(ArticleV1Mixin, 'command', 'create-article'),
  getNodeRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-request'),
  searchNodes: SearchArticlesRequestV1Mixin.findOne(),
};
