import random from 'lodash/random';
import { buffers } from 'redux-saga';
import { actionChannel, call, delay, flush, put, select, take } from 'redux-saga/effects';
import { actionTypes as appActionTypes } from '@triniti/app/constants';
import { actionTypes as iamActionTypes } from '@triniti/cms/plugins/iam/constants';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated';
import ConnectionFailed from '../exceptions/ConnectionFailed';
import rejectConnection from '../actions/rejectConnection';
import { actionTypes } from '../constants';

const maxConnectionAttempts = 5;
/**
 * Helper function that will make a best effort
 * to connect to Raven (Aws Iot) within 5 tries
 * and jitters the delay a bit because science.
 *
 * @param {Raven} raven
 */
function* connect(raven) {
  let error;
  for (let i = 0; i < maxConnectionAttempts; i += 1) {
    try {
      yield call([raven, 'connect']);
      return;
    } catch (e) {
      error = (e && e.message) || `${e}`;
      if (i < 4) {
        yield delay(random(2000, 3000)); // jitter
      }
    }
  }

  throw new ConnectionFailed(error);
}

/**
 * The connectionFlow manages the opening and closing
 * of the Raven service (an mqtt endpoint).
 *
 * @param {Raven} raven
 */
export default function* (raven) {
  const connectsChannel = yield actionChannel(actionTypes.CONNECTION_OPENED, buffers.dropping(1));
  let attempts = 0;

  while (true) {
    yield take([
      appActionTypes.APP_STARTED,
      iamActionTypes.GET_AUTHENTICATED_USER_FULFILLED,
      iamActionTypes.LOGOUT_COMPLETED,
      actionTypes.CONNECTION_CLOSED,
      actionTypes.CONNECTION_REQUESTED,
    ]);

    const authenticated = yield select(isAuthenticated);
    if (!authenticated) {
      // this is a noop if not connected
      yield call([raven, 'disconnect']);
      continue;
    }

    attempts += 1;
    if (attempts > 10) {
      console.error('raven::connectionFlow::exceeded_10_attempts'); // eslint-disable-line no-console
      continue;
    } else if (attempts > 3) {
      // delay a bit before the next attempt
      yield delay(random(5000, 10000)); // jitter
    }

    try {
      // every time a connection occurs we must capture that success
      // as of now, raven async/await is not fully implemented so
      // we're using an action channel here to capture all actions
      yield flush(connectsChannel);
      yield call(connect, raven);
      yield take(connectsChannel);
      attempts = 0;
    } catch (e) {
      yield put(rejectConnection(e));
    }
  }
}
