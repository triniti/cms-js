import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import SearchAssetsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/search-assets-request/SearchAssetsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(AssetV1Mixin, 'command', 'delete-asset'),
  getNodeRequest: resolveSchema(AssetV1Mixin, 'request', 'get-asset-request'),
  node: AssetV1Mixin.findAll(),
  nodeDeleted: resolveSchema(AssetV1Mixin, 'event', 'asset-deleted'),
  searchNodes: SearchAssetsRequestV1Mixin.findOne(),
};
