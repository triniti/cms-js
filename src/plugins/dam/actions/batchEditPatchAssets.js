import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import { actionTypes } from '@triniti/cms/plugins/dam/constants';
import PatchAssetsV1Mixin from '@triniti/schemas/triniti/dam/mixin/patch-assets/PatchAssetsV1Mixin';

export default ({ fields, values }, files, config) => {
  const nodeRefs = files.map((nodeRefStr) => NodeRef.fromString(nodeRefStr));

  const data = {
    paths: fields,
    ...values,
  };

  const pbj = PatchAssetsV1Mixin.findOne().createMessage(data);
  pbj.addToSet('node_refs', nodeRefs);

  return {
    type: actionTypes.PATCH_ASSETS_REQUESTED,
    config,
    pbj,
  };
};
