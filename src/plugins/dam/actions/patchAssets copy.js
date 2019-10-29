import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { actionTypes } from '@triniti/cms/plugins/dam/constants';

export default ({ fields, values }, files, config) => {
  const { schemas } = config;
  const nodeRefs = Object.keys(files).map(hashName => NodeRef.fromNode(files[hashName].asset));

  const data = {
    paths: fields,
    ...values,
  };

  const pbj = schemas.patchAssets.createMessage(data);
  pbj.addToSet('node_refs', nodeRefs);

  return {
    type: actionTypes.PATCH_ASSETS_REQUESTED,
    config,
    pbj,
  };
};
