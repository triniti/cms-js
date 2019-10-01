import { buffers } from 'redux-saga';
import { actionChannel, call, delay, select, take } from 'redux-saga/effects';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated';
import isConnected from '../selectors/isConnected';
import { actionTypes } from '../constants';

/**
 * The publishFlow sends messages out via Raven, one at a time,
 * sequentially and only if still authenticated.
 *
 * If a user at any points becomes logged out or loses their
 * connection then messages are simply dropped. This is
 * intentional for the first phase of this service.
 *
 * @param {Raven} raven
 */
export default function* (raven) {
  const channel = yield actionChannel(actionTypes.PUBLISH_MESSAGE_REQUESTED, buffers.sliding(100));
  const connectsChannel = yield actionChannel(actionTypes.CONNECTION_OPENED, buffers.dropping(1));

  while (true) {
    const action = yield take(channel);
    if (!(yield select(isAuthenticated))) {
      // message is dropped
      continue; // eslint-disable-line no-continue
    }

    if (!(yield select(isConnected))) {
      yield take(connectsChannel);
      yield delay(3000);
    }

    const userRef = yield select(getAuthenticatedUserRef);
    const { message, topic } = action;

    // always tag the outgoing message with the user
    // so the subscribers know who sent it, McFly.
    message.user = `${userRef}`;

    yield call([raven, 'publish'], message, topic);
  }
}
