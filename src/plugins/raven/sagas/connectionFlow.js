import random from 'lodash/random';
import swal from 'sweetalert2';
import { call, delay, put, select, take } from 'redux-saga/effects';
import { actionTypes as appActionTypes } from '@triniti/app/constants';
import { actionTypes as iamActionTypes } from '@triniti/cms/plugins/iam/constants';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated';
import rejectConnection from '../actions/rejectConnection';
import { actionTypes } from '../constants';

/**
 * The connectionFlow manages the opening and closing
 * of the Raven service (an mqtt endpoint).
 *
 * @param {Raven} raven
 */
export default function* (raven) {
  let attempts = 0;

  while (true) {
    yield take([
      appActionTypes.APP_STARTED,
      iamActionTypes.GET_AUTHENTICATED_USER_FULFILLED,
      iamActionTypes.LOGOUT_COMPLETED,
      actionTypes.CONNECTION_CLOSED,
      actionTypes.CONNECTION_REQUESTED,
      actionTypes.PUBLISH_MESSAGE_REQUESTED,
    ]);

    const authenticated = yield select(isAuthenticated);
    if (!authenticated) {
      yield call([raven, 'disconnect']);
      continue;
    }

    const connecting = yield call([raven, 'isConnecting']);
    if (connecting) {
      continue;
    }

    const connected = yield call([raven, 'isConnected']);
    if (connected) {
      attempts = 0;
      continue;
    }

    attempts += 1;
    if (attempts > 3) {
      yield delay(random(5000, 10000));
    }

    try {
      yield call([raven, 'connect']);
      continue;
    } catch (e) {
      yield put(rejectConnection(e));
    }

    if (attempts === 10) {
      yield swal.fire({
        title: 'Alert!',
        text: 'Active Edits has disconnected, please Save and Refresh.',
        type: 'warning',
        confirmButtonText: 'Thank You',
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn-modal btn btn-outline-primary btn-block',
        },
      });
    }
  }
}
