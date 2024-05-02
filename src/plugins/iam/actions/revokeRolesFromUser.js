import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

export default (nodeRef, roles) => async (dispatch, getState, app) => {
  const RevokeRolesFromUserV1 = await MessageResolver.resolveCurie('gdbots:iam:command:revoke-roles-from-user:v1');
  const pbjx = app.getPbjx();
  const command = RevokeRolesFromUserV1.create()
    .set('node_ref', NodeRef.fromString(`${nodeRef}`))
    .addToSet('roles', roles.map(ref => NodeRef.fromString(`${ref}`)));
  await pbjx.send(command);
};
