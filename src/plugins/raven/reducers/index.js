import createReducer from '@triniti/cms/utils/createReducer.js';
import isEmpty from 'lodash-es/isEmpty.js';
import { actionTypes, ravenTypes, connectionStatus, } from '@triniti/cms/plugins/raven/constants.js';
import removeCollaborator from '@triniti/cms/plugins/raven/utils/removeCollaborator.js';
import addCollaborator from '@triniti/cms/plugins/raven/utils/addCollaborator.js';

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

export default createReducer(initialState, {
  [actionTypes.HEARTBEAT]: onCollaboratorJoinedOrHeartbeat,
  [actionTypes.COLLABORATIONS_UPDATED]: onCollaborationsUpdated,
  [actionTypes.COLLABORATOR_JOINED]: onCollaboratorJoinedOrHeartbeat,
  [actionTypes.COLLABORATOR_LEFT]: onCollaboratorLeft,
  [actionTypes.CONNECTION_UPDATED]: onUpdateConnectionStatus,
  [actionTypes.CURRENT_NODE_REF_SET]: onCurrentNodeRefSet,
});
