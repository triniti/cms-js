import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  const StopChannelV1 = await MessageResolver.resolveCurie('triniti:ovp.medialive:command:stop-channel:v1');
  const pbjx = app.getPbjx();
  const command = StopChannelV1.create().set('node_ref', NodeRef.fromString(`${nodeRef}`));
  await pbjx.send(command);
};
