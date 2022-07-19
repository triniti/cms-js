import MessageResolver from '@gdbots/pbj/MessageResolver';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

export default (nodeRef, oldSlug, newSlug) => async (dispatch, getState, app) => {
  const RenameNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:rename-node:v1');
  const pbjx = app.getPbjx();
  const command = RenameNodeV1.create()
    .set('node_ref', NodeRef.fromString(`${nodeRef}`))
    .set('old_slug', oldSlug)
    .set('new_slug', newSlug)
  await pbjx.send(command);
};
