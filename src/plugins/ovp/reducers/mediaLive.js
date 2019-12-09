import ChannelState from '@triniti/schemas/triniti/ovp.medialive/enums/ChannelState';
import createReducer from '@triniti/app/createReducer';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import VideoV1Mixin from '@triniti/schemas/triniti/ovp/mixin/video/VideoV1Mixin';
import resolveSchema from '@triniti/cms/utils/resolveSchema';

export const initialState = {};

const onChannelStarted = (prevState, action) => {
  const state = { ...prevState };
  const nodeRef = action.pbj.get('node_ref');
  state[nodeRef] = state[nodeRef] ? { ...state[nodeRef] } : {};
  state[nodeRef].state = ChannelState.RUNNING.getValue();
  return state;
};

const onChannelStopped = (prevState, action) => {
  const state = { ...prevState };
  const nodeRef = action.pbj.get('node_ref');
  state[nodeRef] = state[nodeRef] ? { ...state[nodeRef] } : {};
  state[nodeRef].state = ChannelState.IDLE.getValue();
  return state;
};

const onGetVideoResponse = (prevState, action) => {
  if (!action.pbj.has('metas') || !action.pbj.get('metas').medialive_channel_state) {
    return prevState;
  }
  const state = { ...prevState };
  const nodeRef = NodeRef.fromNode(action.pbj.get('node'));
  state[nodeRef] = state[nodeRef] ? { ...state[nodeRef] } : {};
  state[nodeRef].state = action.pbj.get('metas').medialive_channel_state;
  return state;
};

const onSearchVideosResponse = (prevState, action) => {
  if (!action.pbj.has('metas') || !action.pbj.get('ctx_request').isInSet('derefs', 'medialive_channel_state')) {
    return prevState;
  }
  const MEDIA_REGEX = /\.media(live|package).+$/;
  const MEDIALIVE_CHANNEL_REGEX = /\.medialive_channel_state$/;
  const MEDIALIVE_INPUT_REGEX = /\.medialive_input_\d+$/;
  const MEDIAPACKAGE_ORIGIN_ENDPOINT_REGEX = /\.mediapackage_origin_endpoint_\d+$/;
  const MEDIAPACKAGE_CDN_ENDPOINT_REGEX = /\.mediapackage_cdn_endpoint_\d+$/;
  let state;
  Object.entries(action.pbj.get('metas')).forEach(([key, value]) => {
    if (!MEDIA_REGEX.test(key)) {
      return;
    }
    if (!state) {
      state = { ...prevState };
    }
    if (MEDIALIVE_CHANNEL_REGEX.test(key)) {
      const nodeRef = key.replace(MEDIALIVE_CHANNEL_REGEX, '');
      state[nodeRef] = state[nodeRef] ? { ...state[nodeRef] } : {};
      state[nodeRef].state = value;
    } else if (MEDIALIVE_INPUT_REGEX.test(key)) {
      const nodeRef = key.replace(MEDIALIVE_INPUT_REGEX, '');
      state[nodeRef] = state[nodeRef] ? { ...state[nodeRef] } : {};
      state[nodeRef].inputs = state[nodeRef].inputs || [];
      state[nodeRef].inputs.push(value);
    } else if (MEDIAPACKAGE_ORIGIN_ENDPOINT_REGEX.test(key)) {
      const nodeRef = key.replace(MEDIAPACKAGE_ORIGIN_ENDPOINT_REGEX, '');
      state[nodeRef] = state[nodeRef] ? { ...state[nodeRef] } : {};
      state[nodeRef].originEndpoints = state[nodeRef].originEndpoints || [];
      state[nodeRef].originEndpoints.push(value);
    } else if (MEDIAPACKAGE_CDN_ENDPOINT_REGEX.test(key)) {
      const nodeRef = key.replace(MEDIAPACKAGE_CDN_ENDPOINT_REGEX, '');
      state[nodeRef] = state[nodeRef] ? { ...state[nodeRef] } : {};
      state[nodeRef].cdnEndpoints = state[nodeRef].cdnEndpoints || [];
      state[nodeRef].cdnEndpoints.push(value);
    }
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
  };
})());
