import PromotionV1Mixin from '@triniti/schemas/triniti/curator/mixin/promotion/PromotionV1Mixin';
import SearchPromotionsRequestV1Mixin from '@triniti/schemas/triniti/curator/mixin/search-promotions-request/SearchPromotionsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  node: PromotionV1Mixin.findOne(),
  nodeCreated: resolveSchema(PromotionV1Mixin, 'event', 'promotion-created'),
  createNode: resolveSchema(PromotionV1Mixin, 'command', 'create-promotion'),
  getNodeRequest: resolveSchema(PromotionV1Mixin, 'request', 'get-promotion-request'),
  searchNodes: SearchPromotionsRequestV1Mixin.findOne(),
};
