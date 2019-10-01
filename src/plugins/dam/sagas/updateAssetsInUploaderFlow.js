import { actionChannel, call, delay, fork, put, putResolve, race } from 'redux-saga/effects';
import { initialize, SubmissionError } from 'redux-form';
import camelCase from 'lodash/camelCase';

import expectedEventTimedoutFlow from '@triniti/cms/plugins/ncr/sagas/expectedEventTimedoutFlow';
import OperationTimedOut from '@triniti/cms/plugins/pbjx/exceptions/OperationTimedOut';
import sendAlert from '@triniti/admin-ui-plugin/actions/sendAlert';
import toast from '@triniti/admin-ui-plugin/utils/toast';
import updateProcessedFileAsset from '@triniti/cms/plugins/dam/actions/updateProcessedFileAsset';
import waitForMyEvent from '@triniti/cms/plugins/ncr/sagas/waitForMyEvent';

/**
 * @param {Function} resolve
 * @param {Message} node
 * @param {Object} config
 * @returns {IterableIterator<*>}
 */
export function* successFlow(resolve, node, config) {
  const data = {};
  ['title', 'description'].forEach((fieldName) => {
    data[camelCase(fieldName)] = node.get(fieldName);
  });

  data.fileSize = node.get('file_size').toNumber();

  data.credit = node.has('credit') ? {
    label: node.get('credit'),
    value: node.get('credit'),
  } : undefined;

  yield put(initialize(config.formName, data));
  yield call(resolve);
  yield call([toast, 'close']);
  yield put(sendAlert({
    type: 'success',
    isDismissible: true,
    delay: 3000,
    message: 'Asset updated',
  }));

  yield put(updateProcessedFileAsset(config.activeHashName, node));
  yield put(config.schemas.searchNodes.createMessage({ count: 25 }));
}

/**
 * command failure handler
 * @param {Function} reject
 * @param {Object} error - an error object
 */
export function* failureFlow(reject, error) {
  const message = typeof error.getMessage === 'function' ? error.getMessage() : error.message;

  yield call(reject, new SubmissionError({ _error: message }));
  yield call([toast, 'close']);
  yield put(sendAlert({
    type: 'danger',
    isDismissible: true,
    message: `Update failed: ${message}`,
  }));
}

/**
 * update node generic flow
 * @param {Object} action
 */
export default function* (action) {
  const pbj = action.pbj;
  const expectedNodeRef = pbj.get('node_ref');
  const config = action.config;
  const expectedEvent = config.schemas.nodeUpdated.getCurie().toString();

  try {
    const eventChannel = yield actionChannel(expectedEvent);
    yield fork([toast, 'show']);
    yield putResolve(pbj);
    const node = pbj.get('new_node');

    const result = yield race({
      event: call(waitForMyEvent, eventChannel),
      timeout: delay(5000),
    });

    const getNodeRequest = config.schemas.getNodeRequest.createMessage().set('node_ref', expectedNodeRef);
    if (result.timeout) {
      const newNode = yield call(expectedEventTimedoutFlow, getNodeRequest, expectedEvent);

      if (!newNode) {
        yield call(failureFlow, action.reject, new OperationTimedOut(pbj));
      } else {
        yield call(successFlow, action.resolve, node, config);
      }
    } else {
      yield call(successFlow, action.resolve, node, config);
    }
  } catch (e) {
    yield call(failureFlow, action.reject, e);
  }
}
