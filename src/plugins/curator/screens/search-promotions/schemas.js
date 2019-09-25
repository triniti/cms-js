import SearchPromotionsRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-promotions-request/SearchPromotionsRequestV1Mixin';
import PromotionV1Mixin from '@triniti/schemas/triniti/curator/mixin/promotion/PromotionV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(PromotionV1Mixin, 'command', 'delete-promotion'),
  getNodeRequest: resolveSchema(PromotionV1Mixin, 'request', 'get-promotion-request'),
  markNodeAsDraft: resolveSchema(PromotionV1Mixin, 'command', 'mark-promotion-as-draft'),
  nodeDeleted: resolveSchema(PromotionV1Mixin, 'event', 'promotion-deleted'),
  nodeMarkedAsDraft: resolveSchema(PromotionV1Mixin, 'event', 'promotion-marked-as-draft'),
  nodePublished: resolveSchema(PromotionV1Mixin, 'event', 'promotion-published'),
  publishNode: resolveSchema(PromotionV1Mixin, 'command', 'publish-promotion'),
  searchNodes: SearchPromotionsRequestV1Mixin.findOne(),
};
