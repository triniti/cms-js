import MessageResolver from '@gdbots/pbj/MessageResolver';
import FormMarshaler from 'utils/FormMarshaler';
import getRootFields from 'utils/getRootFields';

export default (values, form, oldNode) => async (dispatch, getState, app) => {
  const UpdateNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:update-node:v1');
  const formState = form.getState();
  const oldObj = FormMarshaler.marshal(oldNode);
  const paths = getRootFields(Object.keys(formState.dirtyFields));
  paths.forEach(path => delete oldObj[path]);
  const newObj = { ...oldObj, ...values };
  const newNode = await FormMarshaler.unmarshal(newObj);

  const pbjx = app.getPbjx();
  const command = UpdateNodeV1.create()
    .set('node_ref', oldNode.generateNodeRef())
    .set('old_node', oldNode)
    .set('new_node', newNode)
    .set('expected_etag', oldNode.get('etag'))
    .addToSet('paths', paths);
  await pbjx.send(command);
};
