import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (nodeRef, refs) => async (dispatch, getState, app) => {
  const UnlinkAssetsV1 = await MessageResolver.resolveCurie('triniti:dam:command:unlink-assets:v1');
  const pbjx = app.getPbjx();
  const assetRefs = refs.map(ref => ref instanceof NodeRef ? ref : NodeRef.fromString(`${ref}`));
  const command = UnlinkAssetsV1.create();
  command.set('node_ref', NodeRef.fromString(`${nodeRef}`));
  command.addToSet('asset_refs', assetRefs);
  await pbjx.send(command);
};
