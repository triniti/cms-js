import DocumentAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/document-asset/DocumentAssetV1Mixin';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  getDocumentNodeRequest: resolveSchema(DocumentAssetV1Mixin, 'request', 'get-asset-request'),
  getImageNodeRequest: resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request'),
};
