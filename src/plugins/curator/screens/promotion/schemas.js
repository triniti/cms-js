import PromotionV1Mixin from '@triniti/schemas/triniti/curator/mixin/promotion/PromotionV1Mixin';
import SearchPromotionsRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-promotions-request/SearchPromotionsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(PromotionV1Mixin, 'command', 'delete-promotion'),
  getNodeHistoryRequest: resolveSchema(PromotionV1Mixin, 'request', 'get-promotion-history-request'),
  getNodeRequest: resolveSchema(PromotionV1Mixin, 'request', 'get-promotion-request'),
  markNodeAsDraft: resolveSchema(PromotionV1Mixin, 'command', 'mark-promotion-as-draft'),
  markNodeAsPending: resolveSchema(PromotionV1Mixin, 'command', 'mark-promotion-as-pending'),
  nodeDeleted: resolveSchema(PromotionV1Mixin, 'event', 'promotion-deleted'),
  nodeMarkedAsDraft: resolveSchema(PromotionV1Mixin, 'event', 'promotion-marked-as-draft'),
  nodeMarkedAsPending: resolveSchema(PromotionV1Mixin, 'event', 'promotion-marked-as-pending'),
  nodePublished: resolveSchema(PromotionV1Mixin, 'event', 'promotion-published'),
  node: PromotionV1Mixin.findOne(),
  nodeScheduled: resolveSchema(PromotionV1Mixin, 'event', 'promotion-scheduled'),
  nodeUnpublished: resolveSchema(PromotionV1Mixin, 'event', 'promotion-unpublished'),
  nodeUpdated: resolveSchema(PromotionV1Mixin, 'event', 'promotion-updated'),
  publishNode: resolveSchema(PromotionV1Mixin, 'command', 'publish-promotion'),
  searchNodes: SearchPromotionsRequestV1Mixin.findOne(),
  unpublishNode: resolveSchema(PromotionV1Mixin, 'command', 'unpublish-promotion'),
  updateNode: resolveSchema(PromotionV1Mixin, 'command', 'update-promotion'),
};
