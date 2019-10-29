import AssetPatchedV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset-patched/AssetPatchedV1Mixin';
import PatchAssetsV1Mixin from '@triniti/schemas/triniti/dam/mixin/patch-assets/PatchAssetsV1Mixin';
import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  assetPatched: AssetPatchedV1Mixin.findOne(),
  patchAssets: PatchAssetsV1Mixin.findOne(),
  createNode: resolveSchema(AssetV1Mixin, 'command', 'create-asset'),
  getNodeRequest: resolveSchema(AssetV1Mixin, 'request', 'get-asset-request'),
  nodeCreated: resolveSchema(AssetV1Mixin, 'event', 'asset-created'),
  nodeUpdated: resolveSchema(AssetV1Mixin, 'event', 'asset-updated'),
  updateNode: resolveSchema(AssetV1Mixin, 'command', 'update-asset'),
};
