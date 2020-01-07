import SearchUsersRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/search-users-request/SearchUsersRequestV1Mixin';
import SearchUsersSort from '@gdbots/schemas/gdbots/iam/enums/SearchUsersSort';

export default {
  searchNodes: SearchUsersRequestV1Mixin.findOne(),
  searchNodesSort: SearchUsersSort.FIRST_NAME_ASC,
};
