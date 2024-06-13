import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (nodeRef) => async (dispatch, getState, app) => {
  const MarkNodeAsPendingV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:mark-node-as-pending:v1');
  const pbjx = app.getPbjx();
  const command = MarkNodeAsPendingV1.create().set('node_ref', NodeRef.fromString(`${nodeRef}`));
  await pbjx.send(command);
};
