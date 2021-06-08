import AudioAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/audio-asset/AudioAssetV1Mixin';
import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  getAudioNodeRequest: resolveSchema(AudioAssetV1Mixin, 'request', 'get-asset-request'),
  getImageNodeRequest: resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request'),
};
