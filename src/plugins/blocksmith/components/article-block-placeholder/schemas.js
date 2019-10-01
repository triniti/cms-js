import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  getNodeRequest: resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request'),
};
