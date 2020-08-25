/* eslint-disable no-continue */
import { buffers } from 'redux-saga';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import leaveCollaboration from '@triniti/cms/plugins/raven/actions/leaveCollaboration';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import { STATUS_REJECTED, STATUS_FULFILLED } from '@triniti/app/constants';
import {
  actionChannel,
  cancelled,
  cancel,
  call,
  delay,
  fork,
  put,
  race,
  select,
  take,
} from 'redux-saga/effects';

import deleteNode from '../actions/deleteNode';
import deriveNodeOperationStatuses from '../utils/deriveNodeOperationStatuses';
import endBatchOperation from '../actions/endBatchOperation';
import expectedEventTimedoutFlow from './expectedEventTimedoutFlow';
import getBatchOperationState from '../selectors/getBatchOperationState';
import getNode from '../selectors/getNode';
import markNodeAsDraft from '../actions/markNodeAsDraft';
import pauseBatchOperation from '../actions/pauseBatchOperation';
import publishNode from '../actions/publishNode';
import startBatchOperation from '../actions/startBatchOperation';
import updateBatchOperation from '../actions/updateBatchOperation';
import waitForMyEvent from './waitForMyEvent';
import {
  actionTypes,
  batchOperationMessageTypes,
  batchOperationStatuses,
  batchOperationResponseStatus,
} from '../constants';

const { CONFIRMATION, ERROR } = batchOperationMessageTypes;
const { TIMED_OUT } = batchOperationResponseStatus;
const NO_TITLE_FOUND = 'No Title Found';
const {
  BATCH_DELETE_NODES_REQUESTED,
  BATCH_MARK_NODES_AS_DRAFT_REQUESTED,
  BATCH_PUBLISH_NODES_REQUESTED,
  BATCH_OPERATION_PAUSED,
  BATCH_OPERATION_RESUMED,
  BATCH_OPERATION_DESTROYED,
  BATCH_OPERATION_ENDED,
} = actionTypes;

/**
 * Determines the name of the operation by the given action type
 *
 * @param {String} actionType
 *
 * @return {*}
 */
const deriveBatchOperation = (actionType) => {
  if (actionType === BATCH_DELETE_NODES_REQUESTED) {
    return 'DELETE';
  }

  if (actionType === BATCH_PUBLISH_NODES_REQUESTED) {
    return 'PUBLISH';
  }

  if (actionType === BATCH_MARK_NODES_AS_DRAFT_REQUESTED) {
    return 'MARK AS DRAFT';
  }

  return '';
};

/**
 * Derives a message object that will be shaped depending on the batch operation
 * and status of the node. The message "type" property determines if it's an
 * error or a confirmation.
 *
 * @param {Object} node instance of Node
 * @param {String} actionType the type of action requested
 *
 * @return {*}
 */
const deriveBatchOperationValidationMessage = (node, actionType) => {
  const operation = deriveBatchOperation(actionType);

  if (!node) {
    return {
      message: 'Node cannot be found',
      title: null,
      type: ERROR,
      nodeRef: null,
      messageId: operation,
    };
  }

  const title = node.get('title', NO_TITLE_FOUND);
  const nodeStatus = node.get('status');
  const nodeRef = NodeRef.fromNode(node);

  // get message if Batch Delete
  if (actionType === BATCH_DELETE_NODES_REQUESTED) {
    if (nodeStatus === NodeStatus.DELETED) {
      return {
        message: `Item is already in ${nodeStatus.getName()}`,
        title,
        type: CONFIRMATION,
        nodeRef,
        messageId: operation,
      };
    }
  }

  // get message if Batch Publish
  if (actionType === BATCH_PUBLISH_NODES_REQUESTED) {
    if (nodeStatus === NodeStatus.PUBLISHED) {
      return {
        message: `Item is already in ${nodeStatus.getName()}`,
        title,
        type: CONFIRMATION,
        nodeRef,
        messageId: operation,
      };
    }

    const operationStatuses = deriveNodeOperationStatuses(nodeStatus, {
      isPublishNodeGranted: true,
    });

    if (!operationStatuses.canPublish) {
      return {
        message: `Failed to publish since it's in ${nodeStatus.getName()}`,
        title,
        type: ERROR,
        nodeRef,
        messageId: operation,
      };
    }
  }

  // get message if Batch Mark As Draft
  if (actionType === BATCH_MARK_NODES_AS_DRAFT_REQUESTED) {
    if (nodeStatus === NodeStatus.DRAFT) {
      return {
        message: `Item is already in ${nodeStatus.getName()}`,
        title,
        type: CONFIRMATION,
        nodeRef,
        messageId: operation,
      };
    }

    // IMPORTANT: This is special and only happens on Batch Operation.
    // Allows a node to be "Mark As Draft" even if it's in
    // Published state.
    if (nodeStatus === NodeStatus.PUBLISHED) {
      return null;
    }

    const operationStatuses = deriveNodeOperationStatuses(nodeStatus, {
      isMarkNodeAsDraftGranted: true,
    });
    if (!operationStatuses.canMarkAsDraft) {
      return {
        message: `Failed to mark as draft since it's in ${nodeStatus.getName()}`,
        title,
        type: ERROR,
        nodeRef,
        messageId: operation,
      };
    }
  }

  return null;
};

/**
 * Returns the action creator by the provided batch operation action type
 * @param {String} actionType
 * @return {*}
 */
const deriveBatchOperationActionCreator = (actionType) => {
  if (actionType === BATCH_DELETE_NODES_REQUESTED) {
    return deleteNode;
  }

  if (actionType === BATCH_PUBLISH_NODES_REQUESTED) {
    return publishNode;
  }

  if (actionType === BATCH_MARK_NODES_AS_DRAFT_REQUESTED) {
    return markNodeAsDraft;
  }

  return null;
};

/**
 * Creates a rejection message from rejected actionType
 *
 * @param node
 * @param operation
 * @param exception
 *
 * @returns {{nodeRef: NodeRef, messageId: *, state: string, message: *, title: *, type: string}}
 */
const rejectedResponseMessage = (node, operation, exception) => ({
  message: exception.getMessage(),
  title: node.get('title'),
  type: ERROR,
  nodeRef: NodeRef.fromNode(node),
  messageId: operation,
  state: STATUS_REJECTED,
});

/**
 * Create a failure message object based from the server's response
 *
 * @param {Object} node the current node to batch operate
 * @param {String} operation
 * @param {?Object} response the response returned from the server
 *
 * @return {{message: string, title, type, node, messageId: *}}
 */
const failedResponseMessage = (node, operation, response = null) => ({
  message: !response ? `EXCEEDED ALLOTED TIME: Failed to ${operation.toLowerCase()}.`
    : `${response.ctx.state.toUpperCase()}: Failed to ${operation.toLowerCase()}.`,
  title: node.get('title'),
  type: ERROR,
  nodeRef: NodeRef.fromNode(node),
  messageId: operation,
  state: !response ? TIMED_OUT : response.ctx.state,
});

/**
 * Create a success message after the server responded
 * @param {Object} node the current node to batch operate
 * @param {String} operation
 * @param {Object} response the response returned from the server
 * @return {{message: string, title, type, nodeRef, messageId: *}}
 */
const successResponseMessage = (node, operation, response) => ({
  message: `${operation} task is successfully ${response ? response.ctx.state : STATUS_FULFILLED}.`,
  title: node.get('title'),
  type: CONFIRMATION,
  nodeRef: NodeRef.fromNode(node),
  messageId: operation,
  state: response ? response.ctx.state : STATUS_FULFILLED,
});

/**
 * Generator that will wait for the Raven's response and create a message based from it.
 *
 * @param {Object} nodeRef
 * @param {Object} config
 * @param {Number} maxWaitTime
 *
 * @return {*}
 */
export function* waitForValidationResult(nodeRef, config, maxWaitTime = 5000) {
  const node = yield select(getNode, nodeRef);
  const batchOperation = yield select(getBatchOperationState);
  const rejectedEvent = `${config.nodeSchema.getCurie().toString()}.rejected`;
  const rejectedChannel = yield actionChannel(rejectedEvent, buffers.sliding(1));
  const expectedEvent = config.expectedNodeSchema.getCurie().toString();
  const expectedChannel = yield actionChannel(expectedEvent, buffers.sliding(1));

  const result = yield race({
    exception: call(waitForMyEvent, rejectedChannel, 1, true),
    response: call(waitForMyEvent, expectedChannel),
    timeout: delay(maxWaitTime),
  });

  const rejected = result.exception && result.exception.ctx.state === STATUS_REJECTED;
  if (rejected) {
    return rejectedResponseMessage(node, batchOperation.operation, result.exception.ctx.exception);
  }

  const isFailure = result.response && result.response.ctx.state !== STATUS_FULFILLED;
  if (isFailure) {
    return failedResponseMessage(node, batchOperation.operation, result.response);
  }

  if (result.timeout) {
    const getNodeRequest = config.getNodeRequestSchema.createMessage().set('node_ref', nodeRef);
    const newNode = yield call(expectedEventTimedoutFlow, getNodeRequest, expectedEvent);

    if (!newNode) {
      return failedResponseMessage(node, batchOperation.operation);
    }
  }

  return successResponseMessage(node, batchOperation.operation, result.response);
}


/**
 * Initiate validation and updates the BatchOperation state depending on the response/result.
 *
 * @param {Array} nodeRefs the collection of nodeRef
 * @param {Object} config
 */
export function* doRavenValidation(nodeRefs, config) {
  const batchOperation = yield select(getBatchOperationState);
  if (!batchOperation) {
    return;
  }

  const index = batchOperation.messages.length;
  const nodeRef = nodeRefs[index];
  const validationResult = yield call(waitForValidationResult, nodeRef, config);
  yield put(leaveCollaboration(nodeRef));

  const isPaused = (batchOperation.status === batchOperationStatuses.PAUSED);
  if (isPaused && validationResult.state === TIMED_OUT) {
    // if request timed-out, just kill silently if we're already on the paused state
    return;
  }

  const progress = Math.round(((index + 1) / nodeRefs.length) * 100);
  yield put(updateBatchOperation(
    batchOperation.operation,
    progress,
    batchOperation.messages.concat([validationResult]),
  ));

  if (progress === 100) {
    yield put(endBatchOperation());
  } else if (isPaused) {
    yield put(pauseBatchOperation());
  }
}


/**
 * Main generator function that loops through a collection of nodeRefs and execute
 * operation for each (Batch Operation)
 *
 * @param {Array} nodeRefs collection of nodeRef
 * @param {Object} config { nodeSchema, expectedNodeSchema, delay, isNotGrantedMessage }
 * @param {String} actionType the type of action that invokes the generator
 */
export function* batchOperationGenerator(nodeRefs, config, actionType) {
  let pbjPromise;

  try {
    const operation = deriveBatchOperation(actionType);
    const len = nodeRefs.length;
    const cancelledBatchOperationState = yield select(getBatchOperationState);
    const actionCreator = deriveBatchOperationActionCreator(actionType);
    let i = 0;

    if (!cancelledBatchOperationState) {
      yield put(startBatchOperation(operation));
    }

    for (; i < len; i += 1) {
      pbjPromise = null;
      const isTheLastNodeRef = ((i + 1) === len);
      const currentNodeRef = nodeRefs[i];
      const batchOperationState = yield select(getBatchOperationState);
      const messages = batchOperationState ? batchOperationState.messages : [];
      const currentNode = yield select(getNode, currentNodeRef);
      const title = currentNode.get('title') || NO_TITLE_FOUND;
      const validationMessage = deriveBatchOperationValidationMessage(currentNode, actionType);
      const isNodeRefFoundInStore = cancelledBatchOperationState
        && cancelledBatchOperationState.messages.find((message) => message.nodeRef.id
          === currentNodeRef.id);

      // check if we already have this node in the store
      if (isNodeRefFoundInStore) {
        if (isTheLastNodeRef) {
          yield put(endBatchOperation());
        }
        continue;
      }

      if (config.delay) {
        yield delay(config.delay);
      }

      if (validationMessage && validationMessage.type === CONFIRMATION) {
        yield put(updateBatchOperation(
          operation,
          Math.round(((i + 1) / len) * 100),
          messages.concat([validationMessage]),
        ));

        if (isTheLastNodeRef) {
          yield put(endBatchOperation());
        }
        continue;
      }

      try {
        if (validationMessage && validationMessage.type === ERROR) {
          throw validationMessage;
        }
        const action = actionCreator(config.nodeSchema.createMessage({ node_ref: currentNodeRef }));
        pbjPromise = yield put(action.pbj);
        // @todo: find out a way to bubble up all the errors thrown in the generator
        // since errors don't bubble up, this code will suppress the Uncaught promise error messages
        if (pbjPromise) {
          pbjPromise.catch(() => {});
        }
        yield call(doRavenValidation, nodeRefs, config);
      } catch (e) {
        yield put(leaveCollaboration(currentNodeRef));
        let errorMsg = e;
        const unControlledException = !e.messageId || e.messageId !== operation;

        if (unControlledException) {
          // shape the error message to our needs
          errorMsg = {
            message: e.message || 'An error occurred.',
            title,
            type: ERROR,
            nodeRef: currentNodeRef,
            messageId: operation,
          };
        }

        yield put(updateBatchOperation(
          operation,
          Math.round(((i + 1) / len) * 100),
          messages.concat([errorMsg]),
        ));

        if (isTheLastNodeRef) {
          yield put(endBatchOperation());
        }
      }
    }
  } finally {
    const isPaused = yield cancelled();

    if (isPaused) {
      // continue waiting for some pending response
      yield call(doRavenValidation, nodeRefs, config);
    }
  }
}

/**
 * Main entry to batch operation flow
 *
 * @param {Object}
 */
export default function* ({ nodeRefs, config, type }) {
  const isBatchOperationGranted = yield select(isGranted, config.nodeSchema.getCurie().toString());

  if (!isBatchOperationGranted) {
    yield put(sendAlert({
      type: 'danger',
      isDismissible: true,
      delay: 10000,
      message: config.notGrantedMessage || 'Error: Not authorized to perform batch operation.',
    }));

    return;
  }

  let batchOperationTask = yield fork(batchOperationGenerator, nodeRefs, config, type);
  yield take(BATCH_OPERATION_PAUSED);
  yield cancel(batchOperationTask);

  while (true) {
    const actions = yield race({
      resumed: take(BATCH_OPERATION_RESUMED),
      destroyed: take(BATCH_OPERATION_DESTROYED),
      ended: take(BATCH_OPERATION_ENDED),
    });

    if (actions.resumed) {
      // re-run the current batch operation
      batchOperationTask = yield fork(batchOperationGenerator, nodeRefs, config, type);
      // watch if user pause the operation again
      yield take(BATCH_OPERATION_PAUSED);
      yield cancel(batchOperationTask);
    }

    if (actions.done || actions.ended) {
      break;
    }
  }
}
