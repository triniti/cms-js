import AssetPatchedV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset-patched/AssetPatchedV1Mixin';
import AudioAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/audio-asset/AudioAssetV1Mixin';
import DocumentAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/document-asset/DocumentAssetV1Mixin';
import CodeAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/code-asset/CodeAssetV1Mixin';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import UnknownAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/unknown-asset/UnknownAssetV1Mixin';
import VideoAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/video-asset/VideoAssetV1Mixin';
import PatchAssetsV1 from '@triniti/schemas/triniti/dam/patch-assets/PatchAssetsV1';
import GetUploadUrlsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/get-upload-urls-request/GetUploadUrlsRequestV1Mixin';
import GetUploadUrlsResponseV1Mixin from '@triniti/schemas/triniti/dam/mixin/get-upload-urls-response/GetUploadUrlsResponseV1Mixin';
//import SearchAssetsRequestV1Mixin from '@triniti/schemas/triniti/dam/mixin/search-assets-request/SearchAssetsRequestV1Mixin';
// import AssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/asset/AssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';


export default {
  assetPatched: AssetPatchedV1Mixin.findOne(),
  audioAsset: AudioAssetV1Mixin.findOne(),
  documentAsset: DocumentAssetV1Mixin.findOne(),
  codeAsset: CodeAssetV1Mixin.findOne(),
  imageAsset: ImageAssetV1Mixin.findOne(),
  patchAssets: PatchAssetsV1.findOne(),
  unknownAsset: UnknownAssetV1Mixin.findOne(),
  videoAsset: VideoAssetV1Mixin.findOne(),
  getUploadUrlsRequest: GetUploadUrlsRequestV1Mixin.findOne(),
  getUploadUrlsResponse: GetUploadUrlsResponseV1Mixin.findOne(),
  searchNodes: SearchAssetsRequestV1Mixin.findOne(),

  // Note: The resolveSchema method below has to use a mixin that works with `.findOne`. Ideally
  // we should be passing in the AssetV1Mixin but it returns many. Will fix this later.
  createNode: resolveSchema(VideoAssetV1Mixin, 'command', 'create-asset'),
  getNodeRequest: resolveSchema(VideoAssetV1Mixin, 'request', 'get-asset-request'),
  nodeCreated: resolveSchema(VideoAssetV1Mixin, 'event', 'asset-created'),
  nodeUpdated: resolveSchema(VideoAssetV1Mixin, 'event', 'asset-updated'),
  updateNode: resolveSchema(VideoAssetV1Mixin, 'command', 'update-asset'),
};
