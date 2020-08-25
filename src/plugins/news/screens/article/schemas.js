import ArticleV1Mixin from '@triniti/schemas/triniti/news/mixin/article/ArticleV1Mixin';
import SearchArticlesRequestV1Mixin from '@triniti/schemas/triniti/news/mixin/search-articles-request/SearchArticlesRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

import NodeLabelsUpdatedV1 from '@gdbots/schemas/gdbots/ncr/event/NodeLabelsUpdatedV1';

export default {
  node: ArticleV1Mixin.findOne(),
  nodeDeleted: resolveSchema(ArticleV1Mixin, 'event', 'article-deleted'),
  nodeUpdated: resolveSchema(ArticleV1Mixin, 'event', 'article-updated'),
  nodeRenamed: resolveSchema(ArticleV1Mixin, 'event', 'article-renamed'),
  deleteNode: resolveSchema(ArticleV1Mixin, 'command', 'delete-article'),
  getNodeHistoryRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-history-request'),
  getNodeRequest: resolveSchema(ArticleV1Mixin, 'request', 'get-article-request'),
  lockNode: resolveSchema(ArticleV1Mixin, 'command', 'lock-article'),
  markNodeAsDraft: resolveSchema(ArticleV1Mixin, 'command', 'mark-article-as-draft'),
  markNodeAsPending: resolveSchema(ArticleV1Mixin, 'command', 'mark-article-as-pending'),
  nodeLabelsUpdated: NodeLabelsUpdatedV1.schema(),
  nodePublished: resolveSchema(ArticleV1Mixin, 'event', 'article-published'),
  nodeScheduled: resolveSchema(ArticleV1Mixin, 'event', 'article-scheduled'),
  nodeUnpublished: resolveSchema(ArticleV1Mixin, 'event', 'article-unpublished'),
  nodeUnlocked: resolveSchema(ArticleV1Mixin, 'event', 'article-unlocked'),
  nodeLocked: resolveSchema(ArticleV1Mixin, 'event', 'article-locked'),
  nodeMarkedAsDraft: resolveSchema(ArticleV1Mixin, 'event', 'article-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(ArticleV1Mixin, 'event', 'article-marked-as-pending'),
  publishNode: resolveSchema(ArticleV1Mixin, 'command', 'publish-article'),
  renameNode: resolveSchema(ArticleV1Mixin, 'command', 'rename-article'),
  searchNodes: SearchArticlesRequestV1Mixin.findOne(),
  unlockNode: resolveSchema(ArticleV1Mixin, 'command', 'unlock-article'),
  unpublishNode: resolveSchema(ArticleV1Mixin, 'command', 'unpublish-article'),
  updateNode: resolveSchema(ArticleV1Mixin, 'command', 'update-article'),
};
