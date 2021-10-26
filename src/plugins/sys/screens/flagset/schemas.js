import FlagsetV1Mixin from '@triniti/schemas/triniti/sys/mixin/flagset/FlagsetV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import ListAllFlagsetsRequestV1Mixin from '@triniti/schemas/triniti/sys/mixin/list-all-flagsets-request/ListAllFlagsetsRequestV1Mixin';

export default {
  deleteNode: resolveSchema(FlagsetV1Mixin, 'command', 'delete-flagset'),
  getNodeHistory: resolveSchema(FlagsetV1Mixin, 'request', 'get-flagset-history-request'),
  getNodeRequest: resolveSchema(FlagsetV1Mixin, 'request', 'get-flagset-request'),
  updateNode: resolveSchema(FlagsetV1Mixin, 'command', 'update-flagset'),
  node: FlagsetV1Mixin.findOne(),
  nodeDeleted: resolveSchema(FlagsetV1Mixin, 'event', 'flagset-deleted'),
  nodeUpdated: resolveSchema(FlagsetV1Mixin, 'event', 'flagset-updated'),
  searchNodes: ListAllFlagsetsRequestV1Mixin.findOne(),
};
