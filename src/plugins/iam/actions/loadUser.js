import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer.js';
import EnvelopeV1 from '@gdbots/schemas/gdbots/pbjx/EnvelopeV1.js';
import Code from '@gdbots/schemas/gdbots/pbjx/enums/Code.js';
import HttpCode from '@gdbots/schemas/gdbots/pbjx/enums/HttpCode.js';
import Exception from '@gdbots/pbj/Exception.js';
import { vendorToHttp } from '@gdbots/pbjx/utils/statusCodeConverter.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import receiveEnvelope from '@triniti/cms/plugins/pbjx/actions/receiveEnvelope.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import Policy from '@triniti/cms/plugins/iam/Policy.js';
import { actionTypes } from '@triniti/cms/plugins/iam/constants.js';

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

    console.error('fetchUser', e);
    return EnvelopeV1.create()
      .set('ok', false)
      .set('code', code)
      .set('http_code', HttpCode.create(vendorToHttp(code)))
      .set('error_name', e.name)
      .set('error_message', e.message.substring(0, 2048));
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

  dispatch({ type: actionTypes.USER_LOADED, user, policy });
};
