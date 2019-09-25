import { select, take } from 'redux-saga/effects';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';

/**
 * @param {Object} eventChannel       - redux-saga actionChannel
 * @param {number} expectedEventCount - the expected event numbers
 * @param {boolean} skipUserRefCheck
 *
 * @returns {*}
 */
export default function* (eventChannel, expectedEventCount = 0, skipUserRefCheck = false) {
  let eventCount = 0;
  const me = yield select(getAuthenticatedUserRef);

  while (true) {
    const event = yield take(eventChannel);

    if (!skipUserRefCheck) {
      const userRef = event.pbj.has('ctx_user_ref') ? event.pbj.get('ctx_user_ref') : null;

      if (userRef && userRef.getId() === me.getId()) {
        if (!expectedEventCount || expectedEventCount <= 0) {
          return event;
        }

        eventCount += 1;
      }
    } else {
      eventCount += 1;
    }

    if (eventCount === expectedEventCount) {
      return event;
    }
  }
}
