import PersonV1Mixin from '@triniti/schemas/triniti/people/mixin/person/PersonV1Mixin';
import SearchPeopleRequestV1Mixin from '@triniti/schemas/triniti/people/mixin/search-people-request/SearchPeopleRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  createNode: resolveSchema(PersonV1Mixin, 'command', 'create-person'),
  getNodeRequest: resolveSchema(PersonV1Mixin, 'request', 'get-person-request'),
  node: PersonV1Mixin.findOne(),
  nodeCreated: resolveSchema(PersonV1Mixin, 'event', 'person-created'),
  searchNodes: SearchPeopleRequestV1Mixin.findOne(),
};
