import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getMediaLiveChannelStatus from '../../actions/getMediaLiveChannelStatus';

export default (dispatch, { node }) => ({
  handleGetMediaLiveChannelStatus: () => dispatch(getMediaLiveChannelStatus(NodeRef.fromNode(node))),
});
