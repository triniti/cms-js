import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  const StartChannelV1 = await MessageResolver.resolveCurie('triniti:ovp.medialive:command:start-channel:v1');
  const pbjx = app.getPbjx();
  const command = StartChannelV1.create().set('node_ref', NodeRef.fromString(`${nodeRef}`));
  await pbjx.send(command);
};
