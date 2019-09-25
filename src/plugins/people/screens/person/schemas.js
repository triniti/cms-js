import PersonV1Mixin from '@triniti/schemas/triniti/people/mixin/person/PersonV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPeopleRequestV1Mixin from '@triniti/schemas/triniti/people/mixin/search-people-request/SearchPeopleRequestV1Mixin';

export default {
  deleteNode: resolveSchema(PersonV1Mixin, 'command', 'delete-person'),
  getNodeHistoryRequest: resolveSchema(PersonV1Mixin, 'request', 'get-person-history-request'),
  getNodeRequest: resolveSchema(PersonV1Mixin, 'request', 'get-person-request'),
  node: PersonV1Mixin.findOne(),
  nodeDeleted: resolveSchema(PersonV1Mixin, 'event', 'person-deleted'),
  nodeRenamed: resolveSchema(PersonV1Mixin, 'event', 'person-renamed'),
  nodeUpdated: resolveSchema(PersonV1Mixin, 'event', 'person-updated'),
  renameNode: resolveSchema(PersonV1Mixin, 'command', 'rename-person'),
  searchNodes: SearchPeopleRequestV1Mixin.findOne(),
  updateNode: resolveSchema(PersonV1Mixin, 'command', 'update-person'),
};
