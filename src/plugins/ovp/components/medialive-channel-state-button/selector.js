import get from 'lodash/get';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import getMediaLive from '@triniti/cms/plugins/ovp/selectors/getMediaLive';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState';

/**
 * @param {Object} state
 * @param {Object} ownProps
 *
 * @returns {Object}
 */
export default (state, { node }) => ({
  canStartChannel: isGranted(state, 'triniti:ovp.medialive:command:start-channel'),
  canStopChannel: isGranted(state, 'triniti:ovp.medialive:command:stop-channel'),
  channelState: get(getMediaLive(state, NodeRef.fromNode(node)), 'state', ChannelState.UNKNOWN.getValue()),
});
