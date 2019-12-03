import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import getMediaLive from '@triniti/cms/plugins/ovp/selectors/getMediaLive';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { node }) => ({
  isPermissionGranted: isGranted(state, 'triniti:ovp.medialive:command:*'), // todo: remove ||, clearly
  status: (() => {
    if (!node) {
      return undefined;
    }
    const mediaLive = getMediaLive(state, NodeRef.fromNode(node));
    return mediaLive ? mediaLive.status : undefined;
  })(),
});
