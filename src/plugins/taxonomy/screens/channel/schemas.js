import ChannelV1Mixin from '@triniti/schemas/triniti/taxonomy/mixin/channel/ChannelV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export default {
  createNode: resolveSchema(ChannelV1Mixin, 'command', 'create-channel'),
  deleteNode: resolveSchema(ChannelV1Mixin, 'command', 'delete-channel'),
  getNodeHistoryRequest: resolveSchema(ChannelV1Mixin, 'request', 'get-channel-history-request'),
  getNodeRequest: resolveSchema(ChannelV1Mixin, 'request', 'get-channel-request'),
  node: ChannelV1Mixin.findOne(),
  nodeCreated: resolveSchema(ChannelV1Mixin, 'event', 'channel-created'),
  nodeDeleted: resolveSchema(ChannelV1Mixin, 'event', 'channel-deleted'),
  nodeRenamed: resolveSchema(ChannelV1Mixin, 'event', 'channel-renamed'),
  nodeUpdated: resolveSchema(ChannelV1Mixin, 'event', 'channel-updated'),
  renameNode: resolveSchema(ChannelV1Mixin, 'command', 'rename-channel'),
  updateNode: resolveSchema(ChannelV1Mixin, 'command', 'update-channel'),
};
