import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import SearchAssetsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/search-assets-request/SearchAssetsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  deleteNode: resolveSchema(AssetV1Mixin, 'command', 'delete-asset'),
  getNodeHistoryRequest: resolveSchema(AssetV1Mixin, 'request', 'get-asset-history-request'),
  getNodeRequest: resolveSchema(AssetV1Mixin, 'request', 'get-asset-request'),
  nodeDeleted: resolveSchema(AssetV1Mixin, 'event', 'asset-deleted'),
  nodes: AssetV1Mixin.findAll(),
  nodeUpdated: resolveSchema(AssetV1Mixin, 'event', 'asset-updated'),
  searchNodes: SearchAssetsRequestV1Mixin.findOne(),
  updateNode: resolveSchema(AssetV1Mixin, 'command', 'update-asset'),
};
