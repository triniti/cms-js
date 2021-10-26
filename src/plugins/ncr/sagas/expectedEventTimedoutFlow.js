import { call, delay, putResolve, select } from 'redux-saga/effects';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';

/**
 * @param {Message} getNodeRequest
 * @param {string} expectedEvent - the curie of expectedEvent
 * @returns {Message|null}
 */
export default function* (getNodeRequest, { expectedEvent }) {
  // wait for another 3 second after expected event timed out
  yield delay(3000);
  yield call([console, 'warn'], 'pbjx operation timed out, initiate node comparision!');

  let response;
  try {
    response = yield putResolve(getNodeRequest);
  } catch (e) {
    yield call([console, 'error', e]);
    return null;
  }

  if (!response || !response.pbj.get('node')) {
    return null;
  }

  if (expectedEvent.indexOf('created') > -1) {
    return response.pbj.get('node');
  }

  const me = yield select(getAuthenticatedUserRef);

  const currentNode = response.pbj.get('node');
  if (currentNode.get('updater_ref').getId() === me.getId()
    && currentNode.get('last_event_ref').getCurie().toString() === expectedEvent
    // 10000 is a magic number which sums up
    // 1). the expectedEvent timedOut duration (5000 ms)
    // 2). the sleep time before node comparision (3000)
    // 3). and give the internet a little breath time (2000)
    && Math.ceil(Date.now() - (response.pbj.get('node').get('updated_at') / 1000)) < 10000) {
    return currentNode;
  }

  return null;
}
