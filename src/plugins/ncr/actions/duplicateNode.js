import MessageResolver from '@gdbots/pbj/MessageResolver.js';

const ignoredFields = [
  '_id',
  'status',
  'etag',
  'created_at',
  'creator_ref',
  'updated_at',
  'updater_ref',
  'last_event_ref',
  'expires_at',
  'published_at',
  'labels',
];

export default (node) => async (dispatch, getState, app) => {
  const CreateNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:create-node:v1');
  const newNode = await node.clone();

  const schema = node.schema();
  for (let i = 0; i < ignoredFields.length; i++) {
    const field = ignoredFields[i];
    if (schema.hasField(field)) {
      newNode.clear(field);
    }
  }

  newNode.set('title', node.get('title') + ' (duplicate)');

  const pbjx = app.getPbjx();
  const command = CreateNodeV1.create().set('node', newNode);
  await pbjx.send(command);
  return newNode;
};
