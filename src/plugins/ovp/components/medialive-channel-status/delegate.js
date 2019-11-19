import { callPbjx } from '@gdbots/pbjx/redux/actions';
import StartChannelV1 from '@triniti/schemas/triniti/ovp.medialive/command/StartChannelV1';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

export default (dispatch, { node }) => ({
  handleStartChannel: () => {
    const command = StartChannelV1.schema().createMessage({
      node_ref: NodeRef.fromNode(node),
    });
    dispatch(callPbjx(command));
  },
});
