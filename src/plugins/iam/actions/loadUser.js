import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer';
import EnvelopeV1 from '@gdbots/schemas/gdbots/pbjx/EnvelopeV1';
import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code';
import HttpCode from '@gdbots/schemas/gdbots/pbjx/enums/HttpCode';
import Exception from '@gdbots/pbj/Exception';
import { vendorToHttp } from '@gdbots/pbjx/utils/statusCodeConverter';
import sendAlert from 'actions/sendAlert';
import receiveEnvelope from 'plugins/pbjx/actions/receiveEnvelope';
import getAccessToken from 'plugins/iam/selectors/getAccessToken';
import Policy from 'plugins/iam/Policy';
import { actionTypes } from 'plugins/iam/constants';

async function fetchUser(accessToken) {
  try {
    const response = await fetch(`${API_ENDPOINT}/me`, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });

    return await ObjectSerializer.deserialize(await response.json());

  } catch (e) {
    let code = Code.UNAVAILABLE.getValue();
    if (e instanceof Exception) {
      code = e.getCode() || code;
    }

    return EnvelopeV1.create()
      .set('ok', false)
      .set('code', code)
      .set('http_code', HttpCode.create(vendorToHttp(code)))
      .set('error_name', e.name)
      .set('error_message', e.message.substr(0, 2048));
  }
}

export default () => async (dispatch, getState) => {
  const state = getState();
  const accessToken = getAccessToken(state);
  const envelope = await fetchUser(accessToken);

  dispatch(receiveEnvelope(envelope));

  if (!envelope.get('ok')) {
    dispatch(sendAlert({ type: 'danger', message: envelope.get('error_message') }));
    return;
  }

  const user = envelope.get('message').freeze();
  const roles = Object.values(envelope.get('derefs', {}));
  const policy = new Policy(roles);

  dispatch({
    type: actionTypes.USER_LOADED,
    user,
    policy,
    wss: envelope.getFromMap('links', 'wss')
  });
};
