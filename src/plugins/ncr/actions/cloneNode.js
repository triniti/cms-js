import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import FieldRule from '@gdbots/pbj/enums/FieldRule.js';

const ignoredFieldNames = [
  '_id',
  '_schema',
  'created_at',
  'creator_ref',
  'etag',
  'last_event_ref',
  'published_at',
  'status',
  'tags',
  'updated_at',
  'updater_ref',
];

export default (node, nodeClone) => async (dispatch, getState, app) => {
  const CreateNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:create-node:v1');

  let fieldName;
  node.schema().fields.forEach((field) => {
    fieldName = field.getName();
    if (node.get(fieldName) && !ignoredFieldNames.includes(fieldName)) {
      switch (field.getRule()) {
        case FieldRule.A_SINGLE_VALUE:
          nodeClone.set(fieldName, node.get(fieldName));
          break;
        case FieldRule.A_SET:
          nodeClone.addToSet(fieldName, node.get(fieldName));
          break;
        case FieldRule.A_LIST:
          nodeClone.addToList(fieldName, node.get(fieldName));
          break;
        case FieldRule.A_MAP:
          Object.entries(node.get(fieldName)).forEach(([key, value]) => {
            nodeClone.addToMap(fieldName, key, value);
          });
          break;
        default:
          break;
      }
    }
  });
  
  const pbjx = app.getPbjx();
  const command = CreateNodeV1.create().set('node', nodeClone);
  await pbjx.send(command);
};
