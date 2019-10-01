import SearchUsersRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/search-users-request/SearchUsersRequestV1Mixin';
import UserV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/user/UserV1Mixin';

export default {
  searchNodes: SearchUsersRequestV1Mixin.findOne(),
  node: UserV1Mixin.findOne(),
};
