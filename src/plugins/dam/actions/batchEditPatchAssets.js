import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { actionTypes } from '@triniti/cms/plugins/dam/constants';

export default ({ fields, values }, files, config) => {
  const { schemas } = config;
  const nodeRefs = files.map((nodeRefStr) => NodeRef.fromString(nodeRefStr));

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
