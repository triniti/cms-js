import getMediaLive from '@triniti/cms/plugins/ovp/selectors/getMediaLive';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state) => ({
  getMediaLive: (nodeRef) => getMediaLive(state, nodeRef),
  isPermissionGranted: isGranted(state, 'triniti:ovp.medialive:command:*'),
});
