import CategoryV1Mixin from '@triniti/schemas/triniti/taxonomy/mixin/category/CategoryV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchCategoriesRequestV1Mixin
  from '@triniti/schemas/triniti/taxonomy/mixin/search-categories-request/SearchCategoriesRequestV1Mixin';

export default {
  createNode: resolveSchema(CategoryV1Mixin, 'command', 'create-category'),
  getNodeRequest: resolveSchema(CategoryV1Mixin, 'request', 'get-category-request'),
  node: CategoryV1Mixin.findOne(),
  nodeCreated: resolveSchema(CategoryV1Mixin, 'event', 'category-created'),
  searchNodes: SearchCategoriesRequestV1Mixin.findOne(),
};
