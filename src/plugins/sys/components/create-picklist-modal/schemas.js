import PicklistV1Mixin from '@triniti/schemas/triniti/sys/mixin/picklist/PicklistV1Mixin';
import ListAllPicklistsRequestV1Mixin
  from '@triniti/schemas/triniti/sys/mixin/list-all-picklists-request/ListAllPicklistsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  node: PicklistV1Mixin.findOne(),
  nodeCreated: resolveSchema(PicklistV1Mixin, 'event', 'picklist-created'),
  createNode: resolveSchema(PicklistV1Mixin, 'command', 'create-picklist'),
  getNodeRequest: resolveSchema(PicklistV1Mixin, 'request', 'get-picklist-request'),
  searchNodes: ListAllPicklistsRequestV1Mixin.findOne(),
};
