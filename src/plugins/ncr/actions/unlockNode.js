import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  const UnlockNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:unlock-node:v1');
  const pbjx = app.getPbjx();
  const command = UnlockNodeV1.create().set('node_ref', NodeRef.fromString(`${nodeRef}`));
  await pbjx.send(command);
};
