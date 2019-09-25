import createReducer from '@triniti/app/createReducer';
import isEmpty from 'lodash/isEmpty';
import { actionTypes, ravenTypes } from '../constants';

export const initialState = {};

const onCollaboratorJoinedOrHeartbeat = (prevState, action) => {
  const state = { ...prevState };
  state[action.nodeRef] = { ...state[action.nodeRef] };
  state[action.nodeRef][action.userRef] = action.ts;
  return state;
};

const onCollaboratorLeft = (prevState, action) => {
  if (isEmpty(prevState[action.nodeRef])) {
    return prevState;
  }

  const state = { ...prevState };
  delete state[action.nodeRef][action.userRef];
  if (isEmpty(state[action.nodeRef])) {
    delete state[action.nodeRef];
  }

  return state;
};

const onMessageReceived = (prevState, action) => {
  if (!action.message || !action.message.user) {
    return prevState;
  }

  const state = { ...prevState };
  state[action.topic] = { ...state[action.topic] };

  switch (action.message.rt) {
    case ravenTypes.COLLABORATOR_LEFT:
    case ravenTypes.USER_DISCONNECTED:
      delete state[action.topic][action.message.user];
      if (isEmpty(state[action.topic])) {
        delete state[action.topic];
      }
      break;

    default:
      state[action.topic][action.message.user] = action.ts;
  }

  return state;
};

export default createReducer(initialState, {
  [actionTypes.HEARTBEAT]: onCollaboratorJoinedOrHeartbeat,
  [actionTypes.COLLABORATOR_JOINED]: onCollaboratorJoinedOrHeartbeat,
  [actionTypes.COLLABORATOR_LEFT]: onCollaboratorLeft,
  // [actionTypes.MESSAGE_RECEIVED]: onMessageReceived,
});
