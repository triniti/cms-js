import MessageResolver from '@gdbots/pbj/MessageResolver';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';

export default (nodeRef, publishAt = null) => async (dispatch, getState, app) => {
  const PublishNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:publish-node:v1');
  const pbjx = app.getPbjx();
  const command = PublishNodeV1.create()
    .set('node_ref', NodeRef.fromString(`${nodeRef}`))
    .set('publish_at', publishAt);
  await pbjx.send(command);
};
