import PicklistV1Mixin from '@triniti/schemas/triniti/sys/mixin/picklist/PicklistV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  node: PicklistV1Mixin.findOne(),
  getNodeRequest: resolveSchema(PicklistV1Mixin, 'request', 'get-picklist-request'),
};
