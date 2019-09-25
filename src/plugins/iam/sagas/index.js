import { all, call, fork, race, take, takeEvery } from 'redux-saga/effects';
import { actionTypes as uiActionTypes } from '@triniti/admin-ui-plugin/constants';
import handlePermissionFlow from './handlePermissionFlow';
import loginFlow from './loginFlow';
import sessionRenewalFlow from './sessionRenewalFlow';
import tempLoginFlow from './tempLoginFlow';
import { actionTypes, serviceIds } from '../constants';

/**
 * @param {Container} container
 */
function* watchLogin(container) {
  while (true) {
    const { doLogin } = yield race({
      doLogin: take(actionTypes.LOGIN_REQUESTED),
      doLogout: take(uiActionTypes.LOGOUT_REQUESTED),
    });

    const authenticator = container.get(serviceIds.AUTHENTICATOR);
    if (doLogin) {
      yield call(loginFlow, authenticator);
    } else {
      yield call([authenticator, 'logout']);
    }
  }
}

/**
 * This is a watcher for symfony console generated login request
 * @param container
 */
function* watchTempLogin(container) {
  const endpoint = container.get(serviceIds.API_ENDPOINT);
  yield takeEvery(actionTypes.TEMP_LOGIN_REQUESTED, tempLoginFlow, endpoint);
}

function* watchPbjxException() {
  yield takeEvery('@gdbots/pbjx/REJECTED', handlePermissionFlow);
}

/**
 * @param {Container} container
 */
function* watchSessionRenewal(container) {
  const authenticator = container.get(serviceIds.AUTHENTICATOR);
  yield takeEvery(actionTypes.SESSION_RENEWAL_REQUESTED, sessionRenewalFlow, authenticator);
}

export default function* rootSaga(app) {
  yield all([
    fork(watchLogin, app.getContainer()),
    fork(watchSessionRenewal, app.getContainer()),
    fork(watchTempLogin, app.getContainer()),
    fork(watchPbjxException),
  ]);
}
