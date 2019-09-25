import { call, take, put, race } from 'redux-saga/effects';

import closeRavenConnection from '@triniti/cms/plugins/raven/actions/closeConnection';
import requestRavenConnection from '@triniti/cms/plugins/raven/actions/requestConnection';
import connectUserToRaven from '../../raven/actions/connectUser';

import { actionTypes } from '../constants';
import fulfillGetAuthenticatedUser from '../actions/fulfillGetAuthenticatedUser';
import rejectGetAuthenticatedUser from '../actions/rejectGetAuthenticatedUser';
import Policy from '../Policy';
import authRoles from '../utils/authRoles';

export default function* sessionRenewalFlow(authenticator) {
  yield put(closeRavenConnection());

  const { renewalSuccess } = yield race({
    renewalSuccess: take(actionTypes.SESSION_RENEWAL_ACCEPTED),
    renewalFailed: take(actionTypes.SESSION_RENEWAL_REJECTED),
  });

  if (renewalSuccess) {
    try {
      const user = yield call([authenticator, 'getUser'], renewalSuccess.accessToken);
      const policy = new Policy(authRoles.get());
      yield put(fulfillGetAuthenticatedUser(user, policy, renewalSuccess.accessToken));
      yield put(requestRavenConnection());
      yield put(connectUserToRaven());

      // reschedule based on the new session
      yield call([authenticator, 'scheduleRenewal']);
    } catch (e) {
      yield put(rejectGetAuthenticatedUser(e));
    }
  }
}
