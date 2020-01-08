import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import requestStartMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/requestStartMediaLiveChannel';
import requestStopMediaLiveChannel from '@triniti/cms/plugins/ovp/actions/requestStopMediaLiveChannel';
import StartChannelV1 from '@triniti/schemas/triniti/ovp.medialive/command/StartChannelV1';
import StopChannelV1 from '@triniti/schemas/triniti/ovp.medialive/command/StopChannelV1';
import swal from 'sweetalert2';

export default (dispatch, { node }) => ({
  handleStartChannel: () => {
    const command = StartChannelV1.schema().createMessage({
      node_ref: NodeRef.fromNode(node),
    });
    dispatch(requestStartMediaLiveChannel(command));
  },
  handleStopChannel: () => swal.fire({
    title: 'Are you sure you want to stop the channel?',
    text: 'To stream again, you will have to stop the encoders, restart the channel, and then restart the encoders.',
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, stop the channel!',
    confirmButtonClass: 'btn btn-danger',
    cancelButtonClass: 'btn btn-secondary',
    reverseButtons: true,
  }).then(({ value }) => {
    if (!value) {
      return; // user declined
    }
    const command = StopChannelV1.schema().createMessage({
      node_ref: NodeRef.fromNode(node),
    });
    dispatch(requestStopMediaLiveChannel(command));
  }),
});
