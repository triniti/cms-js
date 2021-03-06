import ImageAssetV1Mixin from '@triniti/schemas/triniti/dam/mixin/image-asset/ImageAssetV1Mixin';
import PollV1Mixin from '@triniti/schemas/triniti/apollo/mixin/poll/PollV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  getImageNodeRequest: resolveSchema(ImageAssetV1Mixin, 'request', 'get-asset-request'),
  getPollNodeRequest: resolveSchema(PollV1Mixin, 'request', 'get-poll-request'),
};
