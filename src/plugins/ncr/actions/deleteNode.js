import MessageResolver from '@gdbots/pbj/MessageResolver';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

export default nodeRef => async (dispatch, getState, app) => {
  const DeleteNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:delete-node:v1');
  const pbjx = app.getPbjx();
  const command = DeleteNodeV1.create().set('node_ref', NodeRef.fromString(`${nodeRef}`));
  await pbjx.send(command);
};
