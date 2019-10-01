import { buffers } from 'redux-saga';
import { actionChannel, put, putResolve, select, take } from 'redux-saga/effects';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import GetUserRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/get-user-request/GetUserRequestV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import hasNode from '@triniti/cms/plugins/ncr/selectors/hasNode';
import { actionTypes } from '../constants';

/**
 * The receiveFlow is responsible for taking all of the incoming
 * raven messages (from the websocket) and converting them into
 * safe to execute redux actions.
 *
 * This is CRITICAL as allowing any ole incoming message to be
 * dispatched under the authorization of anyone listening could
 * be rather dangerous.
 *
 * Other noteworthy items in this flow are that messages are
 * dispatched sequentially so that order of operations are
 * consistent (matters order, when conversations having?).
 *
 * We also fetch the userRef if we don't already have them in
 * our local state so we can render their avatar or name.
 */
export default function* () {
  const channel = yield actionChannel(actionTypes.MESSAGE_RECEIVED, buffers.sliding(500));
  const userRef = `${yield select(getAuthenticatedUserRef)}`;
  const getUserRequestSchema = GetUserRequestV1Mixin.findOne();
  const canGetUser = yield select(isGranted, getUserRequestSchema.getCurie().toString());

  while (true) {
    const receivedAction = yield take(channel);
    const { message, topic } = receivedAction;

    const action = { ...message };
    delete action.user;
    action.ts = receivedAction.ts;
    action.userRef = message.user ? NodeRef.fromString(message.user) : null;
    // a user gets a copy of their own published messages
    action.isMe = userRef === message.user;
    action.fromLocal = !!receivedAction.fromLocal;
    action.topic = topic;
    const ravenType = message.rt || 'unknown';

    const type = `RT_${ravenType.toUpperCase()}`;
    if (!actionTypes[type]) {
      console.error('raven::receiveFlow::not approved', type, receivedAction, action);
      // not an approved type, drop it
      continue;
    }

    action.type = actionTypes[type];

    if (!action.isMe && canGetUser && action.userRef) {
      try {
        if (!(yield select(hasNode, action.userRef))) {
          yield putResolve(callPbjx(getUserRequestSchema.createMessage().set('node_ref', action.userRef), 'raven'));
        }
      } catch (e) {
        console.error('raven::receiveFlow::get-user-request-failed', e, receivedAction, action);
      }
    }

    yield put(action);
  }
}
