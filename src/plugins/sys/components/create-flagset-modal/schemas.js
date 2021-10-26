import FlagsetV1Mixin from '@triniti/schemas/triniti/sys/mixin/flagset/FlagsetV1Mixin';
import ListAllFlagsetsRequestV1Mixin from '@triniti/schemas/triniti/sys/mixin/list-all-flagsets-request/ListAllFlagsetsRequestV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  node: FlagsetV1Mixin.findOne(),
  nodeCreated: resolveSchema(FlagsetV1Mixin, 'event', 'flagset-created'),
  createNode: resolveSchema(FlagsetV1Mixin, 'command', 'create-flagset'),
  getNodeRequest: resolveSchema(FlagsetV1Mixin, 'request', 'get-flagset-request'),
  searchNodes: ListAllFlagsetsRequestV1Mixin.findOne(),
};
