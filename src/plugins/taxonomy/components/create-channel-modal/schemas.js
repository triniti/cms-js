import ChannelV1Mixin from '@triniti/schemas/triniti/taxonomy/mixin/channel/ChannelV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import GetAllChannelsRequestV1Mixin
  from '@triniti/schemas/triniti/taxonomy/mixin/get-all-channels-request/GetAllChannelsRequestV1Mixin';

export default {
  createNode: resolveSchema(ChannelV1Mixin, 'command', 'create-channel'),
  getNodeRequest: resolveSchema(ChannelV1Mixin, 'request', 'get-channel-request'),
  node: ChannelV1Mixin.findOne(),
  nodeCreated: resolveSchema(ChannelV1Mixin, 'event', 'channel-created'),
  searchNodes: GetAllChannelsRequestV1Mixin.findOne(),
};
