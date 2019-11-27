import getMediaLive from '@triniti/cms/plugins/ovp/selectors/getMediaLive';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state) => ({
  getMediaLive: (nodeRef) => getMediaLive(state, nodeRef),
});
