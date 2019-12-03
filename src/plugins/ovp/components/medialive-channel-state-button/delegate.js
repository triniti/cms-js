import StartChannelV1 from '@triniti/schemas/triniti/ovp.medialive/command/StartChannelV1';
import StopChannelV1 from '@triniti/schemas/triniti/ovp.medialive/command/StopChannelV1';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import requestStartMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/requestStartMediaLiveChannel';
import requestStopMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/requestStopMediaLiveChannel';

export default (dispatch, { node }) => ({
  handleStartChannel: () => {
    const command = StartChannelV1.schema().createMessage({
      node_ref: NodeRef.fromNode(node),
    });
    dispatch(requestStartMediaLiveChannel(command));
  },
  handleStopChannel: () => {
    const command = StopChannelV1.schema().createMessage({
      node_ref: NodeRef.fromNode(node),
    });
    dispatch(requestStopMediaLiveChannel(command));
  },
});
