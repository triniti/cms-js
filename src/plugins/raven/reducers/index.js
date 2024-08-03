import isEmpty from 'lodash-es/isEmpty.js';
import createReducer from '@triniti/cms/utils/createReducer.js';
import { actionTypes, connectionStatus } from '@triniti/cms/plugins/raven/constants.js';

export const initialState = {
  collaborations: {},
  status: connectionStatus.DISCONNECTED,
};

const onConnecting = (state) => ({ ...state, status: connectionStatus.CONNECTING });
const onConnected = (state) => ({ ...state, status: connectionStatus.CONNECTED });
const onConnectFailed = (state) => ({ ...state, status: connectionStatus.FAILED });
const onDisconnected = (state) => ({ ...state, status: connectionStatus.DISCONNECTED });

const onCollaboratorJoinedOrHeartbeat = (prevState, action) => {
  const state = { ...prevState };
  state.collaborations[action.nodeRef] = { ...state.collaborations[action.nodeRef] };
  state.collaborations[action.nodeRef][action.userRef] = action.ts;
  return state;
};

const onCollaboratorLeft = (prevState = {}, action) => {
  if (isEmpty(prevState.collaborations[action.nodeRef])) {
    return prevState;
  }

  const state = { ...prevState };
  delete state.collaborations[action.nodeRef][action.userRef];
  if (isEmpty(state.collaborations[action.nodeRef])) {
    delete state.collaborations[action.nodeRef];
  }

  return state;
};

export default createReducer(initialState, {
  [actionTypes.CONNECTING]: onConnecting,
  [actionTypes.CONNECTED]: onConnected,
  [actionTypes.CONNECT_FAILED]: onConnectFailed,
  [actionTypes.DISCONNECTED]: onDisconnected,
  [actionTypes.COLLABORATOR_JOINED]: onCollaboratorJoinedOrHeartbeat,
  [actionTypes.COLLABORATOR_LEFT]: onCollaboratorLeft,
  [actionTypes.HEARTBEAT]: onCollaboratorJoinedOrHeartbeat,
});
