import SearchCategoriesRequestV1Mixin
  from '@triniti/schemas/triniti/taxonomy/mixin/search-categories-request/SearchCategoriesRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import CategoryV1Mixin from '@triniti/schemas/triniti/taxonomy/mixin/category/CategoryV1Mixin';

export default {
  createNode: resolveSchema(CategoryV1Mixin, 'command', 'create-category'),
  deleteNode: resolveSchema(CategoryV1Mixin, 'command', 'delete-category'),
  getNodeRequest: resolveSchema(CategoryV1Mixin, 'request', 'get-category-request'),
  node: CategoryV1Mixin.findOne(),
  nodeCreated: resolveSchema(CategoryV1Mixin, 'event', 'category-created'),
  nodeDeleted: resolveSchema(CategoryV1Mixin, 'event', 'category-deleted'),
  nodeUpdated: resolveSchema(CategoryV1Mixin, 'event', 'category-updated'),
  searchNodes: SearchCategoriesRequestV1Mixin.findOne(),
  updateNode: resolveSchema(CategoryV1Mixin, 'command', 'update-category'),
};
