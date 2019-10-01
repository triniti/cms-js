import SearchUsersRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/search-users-request/SearchUsersRequestV1Mixin';
import UserV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/user/UserV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  createNode: resolveSchema(UserV1Mixin, 'command', 'create-user'),
  getNodeRequest: resolveSchema(UserV1Mixin, 'request', 'get-user-request'),
  node: UserV1Mixin.findOne(),
  nodeCreated: resolveSchema(UserV1Mixin, 'event', 'user-created'),
  searchNodes: SearchUsersRequestV1Mixin.findOne(),
};
