import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state) => {
  const getVideoRequestSchema = resolveSchema(VideoV1Mixin, 'request', 'get-video-request');
  const { response } = getRequest(state, getVideoRequestSchema.getCurie());
  let status = 'UNKNOWN';
  if (response && response.has('metas') && response.get('metas').medialive_channel_status) {
    status = response.get('metas').medialive_channel_status;
  }
  return {
    status,
  };
};
