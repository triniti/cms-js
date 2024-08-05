import isEmpty from 'lodash-es/isEmpty.js';
import createReducer from '@triniti/cms/utils/createReducer.js';
import { actionTypes, connectionStatus } from '@triniti/cms/plugins/raven/constants.js';

export const initialState = {
  collaborationsKeys: [],
  collaborations: {},
  status: connectionStatus.DISCONNECTED,
};

const onConnecting = (state) => ({ ...state, status: connectionStatus.CONNECTING });

const onConnected = (prevState, action) => {
  if (!action.isMine) {
    return prevState;
  }

  return { ...prevState, status: connectionStatus.CONNECTED };
};

const onConnectFailed = (state) => ({ ...state, status: connectionStatus.FAILED });

const onDisconnected = (prevState, action) => {
  if (action.isMine && action.fromWss) {
    // this means we're still connected, user closed
    // another tab/browser but THIS tab is still connected.
    return prevState;
  }

  const state = { ...prevState };
  if (action.isMine && !action.fromWss) {
    state.status = connectionStatus.DISCONNECTED;
  }

  const nodeRefs = Object.keys(state.collaborations);
  for (const nodeRef of nodeRefs) {
    if (isEmpty(state.collaborations[nodeRef])) {
      continue;
    }

    delete state.collaborations[nodeRef][action.userRef];

    if (isEmpty(state.collaborations[nodeRef])) {
      delete state.collaborations[nodeRef];
    }
  }

  state.collaborationsKeys = Object.keys(state.collaborations);
  return state;
};

const onCollaboratorJoinedOrHeartbeat = (prevState, action) => {
  const state = { ...prevState };
  state.collaborations[action.nodeRef] = { ...state.collaborations[action.nodeRef] };
  state.collaborations[action.nodeRef][action.userRef] = action.ts;
  state.collaborationsKeys = Object.keys(state.collaborations);
  return state;
};

const onCollaboratorLeft = (prevState = {}, action) => {
  const state = { ...prevState };
  if (isEmpty(state.collaborations[action.nodeRef])) {
    delete state.collaborations[action.nodeRef];
    state.collaborationsKeys = Object.keys(state.collaborations);
    return state;
  }

  delete state.collaborations[action.nodeRef][action.userRef];
  if (isEmpty(state.collaborations[action.nodeRef])) {
    delete state.collaborations[action.nodeRef];
  }

  state.collaborationsKeys = Object.keys(state.collaborations);
  return state;
};

const onPruneCollaborators = (prevState = {}) => {
  const state = { ...prevState };
  const aliveAfter = Math.floor(Date.now() / 1000) - 30;

  const nodeRefs = Object.keys(state.collaborations);
  for (const nodeRef of nodeRefs) {
    if (isEmpty(state.collaborations[nodeRef])) {
      delete state.collaborations[nodeRef];
      continue;
    }

    const userRefs = Object.keys(state.collaborations[nodeRef]);
    for (const userRef of userRefs) {
      if (state.collaborations[nodeRef][userRef] < aliveAfter) {
        delete state.collaborations[nodeRef][userRef];
      }
    }

    if (isEmpty(state.collaborations[nodeRef])) {
      delete state.collaborations[nodeRef];
    }
  }

  state.collaborationsKeys = Object.keys(state.collaborations);
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
  [actionTypes.PRUNE_COLLABORATORS]: onPruneCollaborators,
});
