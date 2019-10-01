import PersonV1Mixin from '@triniti/schemas/triniti/people/mixin/person/PersonV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import SearchPeopleRequestV1Mixin from '@triniti/schemas/triniti/people/mixin/search-people-request/SearchPeopleRequestV1Mixin';

export default {
  deleteNode: resolveSchema(PersonV1Mixin, 'command', 'delete-person'),
  getNodeRequest: resolveSchema(PersonV1Mixin, 'request', 'get-person-request'),
  nodeDeleted: resolveSchema(PersonV1Mixin, 'event', 'person-deleted'),
  searchNodes: SearchPeopleRequestV1Mixin.findOne(),
};
