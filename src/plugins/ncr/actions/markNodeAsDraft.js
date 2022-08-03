import MessageResolver from '@gdbots/pbj/MessageResolver';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

export default (nodeRef) => async (dispatch, getState, app) => {
  const MarkNodeAsDraftV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:mark-node-as-draft:v1');
  const pbjx = app.getPbjx();
  const command = MarkNodeAsDraftV1.create().set('node_ref', NodeRef.fromString(`${nodeRef}`));
  await pbjx.send(command);
};
