import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import getMedialiveChannelStatus from '@triniti/cms/plugins/ovp/selectors/getMedialiveChannelStatus';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { node }) => ({
  isPermissionGranted: true || isGranted(state, 'triniti:ovp.medialive:command:*'), // todo: remove ||, clearly
  status: node ? getMedialiveChannelStatus(state, NodeRef.fromNode(node)) : undefined,
});
