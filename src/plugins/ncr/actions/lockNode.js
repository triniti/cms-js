import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  const LockNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:lock-node:v1');
  const pbjx = app.getPbjx();
  const command = LockNodeV1.create().set('node_ref', NodeRef.fromString(`${nodeRef}`));
  await pbjx.send(command);
};
