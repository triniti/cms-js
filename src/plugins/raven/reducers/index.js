import createReducer from 'utils/createReducer';
import isEmpty from 'lodash/isEmpty';
import { actionTypes, ravenTypes, connectionStatus, } from 'plugins/raven/constants';
import removeCollaborator from 'plugins/raven/utils/removeCollaborator';
import addCollaborator from 'plugins/raven/utils/addCollaborator';

export const initialState = {
  collaborations: {},
  connection: connectionStatus.CLOSED,
  messages: {},
  currNodeRef: null,
};

const onCollaboratorJoinedOrHeartbeat = (prevState, { nodeRef, userRef }) => ({ ...prevState, collaborations: addCollaborator(prevState.collaborations, nodeRef, userRef) });

const onCollaboratorLeft = (prevState, action) => {
  if (isEmpty(prevState.collaborations[action.nodeRef])) {
    return prevState;
  }

  return {
    ...prevState,
    collaborations: removeCollaborator(prevState.collaborations, action.nodeRef, action.userRef),
  }
};

const onCollaborationsUpdated = (prevState, { collaborations }) => ({ ...prevState, collaborations });

const onUpdateConnectionStatus = (prevState, { status }) => ({ ...prevState, connection: status, });

const onCurrentNodeRefSet = (prevState, { nodeRef }) => ({ ...prevState, currNodeRef: nodeRef, });

const onMessageReceived = (prevState, action) => {
  if (!action.message || !action.message.user) {
    return prevState;
  }

  const state = { ...prevState };
  state[action.topic] = state[action.topic] ? [ ...state[action.topic] ] : [];

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
  [actionTypes.COLLABORATIONS_UPDATED]: onCollaborationsUpdated,
  [actionTypes.COLLABORATOR_JOINED]: onCollaboratorJoinedOrHeartbeat,
  [actionTypes.COLLABORATOR_LEFT]: onCollaboratorLeft,
  [actionTypes.CONNECTION_UPDATED]: onUpdateConnectionStatus,
  [actionTypes.CURRENT_NODE_REF_SET]: onCurrentNodeRefSet,
  // [actionTypes.MESSAGE_RECEIVED]: onMessageReceived,
});