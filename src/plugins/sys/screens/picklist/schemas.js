import PicklistV1Mixin from '@triniti/schemas/triniti/sys/mixin/picklist/PicklistV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import ListAllPicklistsRequestV1Mixin from '@triniti/schemas/triniti/sys/mixin/list-all-picklists-request/ListAllPicklistsRequestV1Mixin';

export default {
  deleteNode: resolveSchema(PicklistV1Mixin, 'command', 'delete-picklist'),
  getNodeHistory: resolveSchema(PicklistV1Mixin, 'request', 'get-picklist-history-request'),
  getNodeRequest: resolveSchema(PicklistV1Mixin, 'request', 'get-picklist-request'),
  updateNode: resolveSchema(PicklistV1Mixin, 'command', 'update-picklist'),
  node: PicklistV1Mixin.findOne(),
  nodeDeleted: resolveSchema(PicklistV1Mixin, 'event', 'picklist-deleted'),
  nodeUpdated: resolveSchema(PicklistV1Mixin, 'event', 'picklist-updated'),
  searchNodes: ListAllPicklistsRequestV1Mixin.findOne(),
};
