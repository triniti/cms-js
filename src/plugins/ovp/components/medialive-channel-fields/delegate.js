import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getMedialiveChannelStatus from '../../actions/getMedialiveChannelStatus';

export default (dispatch, { node }) => ({
  handleGetMedialiveChannelStatus: () => dispatch(getMedialiveChannelStatus(NodeRef.fromNode(node))),
});
