import AssetLinkedV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset-linked/AssetLinkedV1Mixin';
import AssetUnlinkedV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset-unlinked/AssetUnlinkedV1Mixin';
import LinkAssetsV1Mixin from '@triniti/schemas/triniti/dam/mixin/link-assets/LinkAssetsV1Mixin';
import SearchAssetsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/search-assets-request/SearchAssetsRequestV1Mixin';
import UnlinkAssetsV1Mixin from '@triniti/schemas/triniti/dam/mixin/unlink-assets/UnlinkAssetsV1Mixin';

export default {
  assetLinked: AssetLinkedV1Mixin.findOne(),
  assetUnlinked: AssetUnlinkedV1Mixin.findOne(),
  linkAssets: LinkAssetsV1Mixin.findOne(),
  searchNodesRequest: SearchAssetsRequestV1Mixin.findOne(),
  unlinkAssets: UnlinkAssetsV1Mixin.findOne(),
};
