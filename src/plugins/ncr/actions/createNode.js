import MessageResolver from '@gdbots/pbj/MessageResolver';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler';
import getRootFields from '@triniti/cms/utils/getRootFields';

export default (values, form, node) => async (dispatch, getState, app) => {
  const CreateNodeV1 = await MessageResolver.resolveCurie('gdbots:ncr:command:create-node:v1');
  const formState = form.getState();
  const oldObj = FormMarshaler.marshal(node, { skipValidation: true });
  const paths = getRootFields(Object.keys(formState.dirtyFields));
  paths.forEach(path => delete oldObj[path]);
  const newObj = { ...oldObj, ...values };
  const newNode = await FormMarshaler.unmarshal(newObj);

  const pbjx = app.getPbjx();
  const command = CreateNodeV1.create().set('node', newNode);
  await pbjx.send(command);
};
