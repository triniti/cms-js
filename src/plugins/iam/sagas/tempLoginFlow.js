import { call, put } from 'redux-saga/effects';

import { ACCESS_TOKEN_STORAGE_KEY } from '@gdbots/pbjx/constants';
import Exception from '@gdbots/common/Exception';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code';
import EnvelopeV1 from '@gdbots/schemas/gdbots/pbjx/EnvelopeV1';
import HttpCode from '@gdbots/schemas/gdbots/pbjx/enums/HttpCode';
import { vendorToHttp } from '@gdbots/pbjx/utils/statusCodeConverter';
import HttpRequestFailed from '@triniti/cms/plugins/iam/exceptions/HttpRequestFailed';
import receiveEnvelope from '@triniti/cms/plugins/pbjx/actions/receiveEnvelope';

import acceptLogin from '../actions/acceptLogin';
import fulfillGetAuthenticatedUser from '../actions/fulfillGetAuthenticatedUser';
import rejectGetAuthenticatedUser from '../actions/rejectGetAuthenticatedUser';
import rejectLogin from '../actions/rejectLogin';
import Policy from '../Policy';
import authRoles from '../utils/authRoles';
import authUser from '../utils/authUser';

/**
 * @param {string} accessToken
 * @param {string} apiEndpoint
 * @returns {Promise.<Message>} Resolves with a message using mixin 'gdbots:iam:mixin:user'
 */
function* getUser(accessToken, apiEndpoint) {
  let envelope;

  try {
    const response = yield call(
      [window, 'fetch'],
      `${apiEndpoint}/me`,
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      },
    );

    const json = yield call([response, 'json']);
    envelope = ObjectSerializer.deserialize(json);
    yield put(receiveEnvelope(envelope));
  } catch (e) {
    let code = Code.UNAVAILABLE.getValue();
    if (e instanceof Exception) {
      code = e.getCode() || code;
    }

    envelope = EnvelopeV1.create()
      .set('ok', false)
      .set('code', code)
      .set('http_code', HttpCode.create(vendorToHttp(code)))
      .set('error_name', e.name)
      .set('error_message', e.message.substr(0, 2048));
  }

  if (envelope.get('ok')) {
    const user = envelope.get('message');
    user.freeze();
    yield call([authUser, 'set'], user);
    yield call([authRoles, 'set'], Object.values(envelope.get('derefs')));

    return user;
  }

  throw new HttpRequestFailed(envelope);
}

export default function* tempLoginFlow(apiEndpoint, { accessToken, resolve, reject }) {
  try {
    const user = yield call(getUser, accessToken, apiEndpoint);
    const roles = yield call([authRoles, 'get']);

    yield put(acceptLogin(accessToken));
    yield put(fulfillGetAuthenticatedUser(user, new Policy(roles), accessToken));
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);

    yield call(resolve);
  } catch (e) {
    yield put(rejectGetAuthenticatedUser(e));
    yield put(rejectLogin(e));
    yield call(reject);
  }
}
