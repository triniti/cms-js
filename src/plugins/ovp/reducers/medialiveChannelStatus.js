import createReducer from '@triniti/app/createReducer';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';
import { actionTypes } from '../constants';

export const initialState = {};

const onChannelStarted = (prevState, action) => {
  const state = { ...prevState };
  state[action.nodeRef || action.pbj.get('node_ref')] = 'RUNNING';
  return state;
};

const onChannelStopped = (prevState, action) => {
  const state = { ...prevState };
  state[action.nodeRef || action.pbj.get('node_ref')] = 'IDLE';
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

const onSearchVideosResponse = (prevState, action) => {
  if (!action.pbj.has('metas') || !action.pbj.get('ctx_request').isInSet('derefs', 'medialive_channel_status')) {
    return prevState;
  }
  const MEDIALIVE_KEY_REGEX = /^medialive_channel_status\./;
  let state;
  Object.entries(action.pbj.get('metas')).forEach(([key, value]) => {
    if (!MEDIALIVE_KEY_REGEX.test(key)) {
      return;
    }
    if (!state) {
      state = { ...prevState };
    }
    state[NodeRef.fromString(key.replace(MEDIALIVE_KEY_REGEX, ''))] = value;
  });
  return state || prevState;
};

export default createReducer(initialState, (() => {
  const vendor = resolveSchema(VideoV1Mixin, 'request', 'get-video-request').getCurie().getVendor();
  return {
    'triniti:ovp.medialive:event:channel-started': onChannelStarted,
    'triniti:ovp.medialive:event:channel-stopped': onChannelStopped,
    [`${vendor}:ovp:request:get-video-response`]: onGetVideoResponse,
    [`${vendor}:ovp:request:search-videos-response`]: onSearchVideosResponse,
    [actionTypes.MEDIALIVE_CHANNEL_STARTED]: onChannelStarted,
    [actionTypes.MEDIALIVE_CHANNEL_STOPPED]: onChannelStopped,
  };
})());
