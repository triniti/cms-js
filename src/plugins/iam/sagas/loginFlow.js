import { call, take, put } from 'redux-saga/effects';
import { actionTypes as adminUiActionTypes } from '@triniti/admin-ui-plugin/constants';
import { actionTypes } from '../constants';
import fulfillGetAuthenticatedUser from '../actions/fulfillGetAuthenticatedUser';
import rejectGetAuthenticatedUser from '../actions/rejectGetAuthenticatedUser';
import rejectLogin from '../actions/rejectLogin';
import Policy from '../Policy';
import authRoles from '../utils/authRoles';

export default function* loginFlow(authenticator) {
  yield call([authenticator, 'showLogin']);

  const { accessToken } = yield take(actionTypes.LOGIN_ACCEPTED);

  try {
    const user = yield call([authenticator, 'getUser'], accessToken);

    const policy = new Policy(authRoles.get());

    yield put(fulfillGetAuthenticatedUser(user, policy, accessToken));
    yield call([authenticator, 'hideLogin']);
    yield call([authenticator, 'checkUserIdle']);
  } catch (e) {
    yield put(rejectGetAuthenticatedUser(e));
    yield put(rejectLogin(e));
  }

  yield take(adminUiActionTypes.LOGOUT_REQUESTED);
  yield call([authenticator, 'logout']);
}
