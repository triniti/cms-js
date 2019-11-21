import createReducer from '@triniti/app/createReducer';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export const initialState = {};

const onChannelStarted = (prevState, action) => {
  const state = { ...prevState };
  state[action.pbj.get('node_ref')] = 'RUNNING';
  return state;
};

const onChannelStopped = (prevState, action) => {
  const state = { ...prevState };
  state[action.pbj.get('node_ref')] = 'IDLE';
  return state;
};

const onGetVideoResponse = (prevState, action) => {
  if (!action.pbj.has('metas') || !action.pbj.get('metas').medialive_channel_status) {
    return prevState;
  }
  const state = { ...prevState };
  state[NodeRef.fromNode(action.pbj.get('node'))] = action.pbj.get('metas').medialive_channel_status;
  return state;
};

export default createReducer(initialState, {
  'triniti:ovp.medialive:event:channel-started': onChannelStarted,
  'triniti:ovp.medialive:event:channel-stopped': onChannelStopped,
  [`${resolveSchema(VideoV1Mixin, 'request', 'get-video-request').getCurie().getVendor()}:ovp:request:get-video-response`]: onGetVideoResponse,
});
