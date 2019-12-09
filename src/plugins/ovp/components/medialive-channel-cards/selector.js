import getMediaLive from '@triniti/cms/plugins/ovp/selectors/getMediaLive';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state) => ({
  canViewIngests: isGranted(state, 'triniti:ovp.medialive:command:stop-channel'),
  getMediaLive: (nodeRef) => getMediaLive(state, nodeRef),
});
