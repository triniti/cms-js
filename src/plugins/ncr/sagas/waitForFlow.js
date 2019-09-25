import { delay, putResolve } from 'redux-saga/effects';

const MAX_ATTEMPTS = 5;

/**
 * @param {Schema}   schema  - schema using 'gdbots:ncr:mixin:get-node-request'
 * @param {NodeRef}  nodeRef
 * @param {function} verify
 *
 * @returns {?Message}
 */
export default function* (schema, nodeRef, verify) {
  let attempts = 0;

  do {
    attempts += 1;
    const nextDelay = 200 * attempts;

    try {
      const request = schema.createMessage().set('node_ref', nodeRef);
      const response = yield putResolve(request);
      if (verify(response)) {
        return true;
      }
      yield delay(nextDelay);
    } catch (e) {
      yield delay(nextDelay);
    }
  } while (attempts < MAX_ATTEMPTS);

  return false;
}
