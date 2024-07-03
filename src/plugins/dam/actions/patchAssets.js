import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (refs, fields) => async (dispatch, getState, app) => {
  const PatchAssetsV1 = await MessageResolver.resolveCurie('triniti:dam:command:patch-assets:v1');
  const pbjx = app.getPbjx();
  const nodeRefs = refs.map(ref => ref instanceof NodeRef ? ref : NodeRef.fromString(`${ref}`));
  const command = await PatchAssetsV1.fromObject(fields);
  command.addToSet('node_refs', nodeRefs);
  command.addToSet('paths', Object.keys(fields));
  await pbjx.send(command);
};
