/* eslint-disable */
// fixme: cleanup loops/code if this strategy works
import { call, delay, put, putResolve, select } from 'redux-saga/effects';
import { callPbjx } from '@gdbots/pbjx/redux/actions';
import GetUserRequestV1Mixin from '@gdbots/schemas/gdbots/iam/mixin/get-user-request/GetUserRequestV1Mixin';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken';
import getAuthenticatedUserRef from '@triniti/cms/plugins/iam/selectors/getAuthenticatedUserRef';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated';
import isGranted from '@triniti/cms/plugins/iam/selectors/isGranted';
import isJwtExpired from '@triniti/cms/plugins/iam/utils/isJwtExpired';
import hasNode from '@triniti/cms/plugins/ncr/selectors/hasNode';
import { actionTypes, collaborationTopics } from '../constants';

const getCollaborations = async (accessToken) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/raven/collaborations/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: 'include',
    });
    const data = await response.json();
    return data.collaborations || {};
  } catch (error) {
    console.error('raven::pollCollaborationsFlow::getCollaborations failed', error);
    return {};
  }
};

/**
 * The pollCollaborationsFlow is a backup to the raven websockets
 * and is responsible for polling an api endpoint which will report
 * on the active collaborations.
 *
 * Typically raven will communicate heartbeats in milliseconds but
 * if the user loses their connection to the websocket and it
 * doesn't recover then this polling serves as the "backup".
 */
export default function* () {
  const getUserRequestSchema = GetUserRequestV1Mixin.findOne();
  const canGetUser = yield select(isGranted, getUserRequestSchema.getCurie().toString());

  while (true) {
    if (!(yield select(isAuthenticated))) {
      return;
    }

    const accessToken = yield select(getAccessToken);
    if (isJwtExpired(accessToken)) {
      return;
    }

    if (document.hidden) {
      yield delay(5000);
      continue;
    }

    const myRef = yield select(getAuthenticatedUserRef);
    const collaborations = yield call(getCollaborations, accessToken);

    for (let nodeRef in collaborations) {
      if (!collaborations.hasOwnProperty(nodeRef)) {
        continue;
      }

      const collaborators = collaborations[nodeRef];
      for (let ref in collaborators) {
        if (!collaborators.hasOwnProperty(ref)) {
          continue;
        }

        const userRef = NodeRef.fromString(ref);
        const ts = collaborators[ref];
        if (canGetUser && !userRef.equals(myRef)) {
          try {
            if (!(yield select(hasNode, userRef))) {
              yield putResolve(callPbjx(getUserRequestSchema.createMessage().set('node_ref', userRef), 'raven'));
            }
          } catch (e) {
            console.error('raven::pollCollaborationsFlow::get-user-request-failed', e, collaborations, ref);
          }
        }

        yield put({ type: actionTypes.HEARTBEAT, nodeRef, userRef: ref, ts });
      }
    }

    // force re-rendering of all collaborator components by changing the state
    yield put({
      type: actionTypes.HEARTBEAT,
      nodeRef: collaborationTopics.FAKE_ARTICLE,
      userRef: 'acme:user:fake-user',
      ts: Math.floor(Date.now() / 1000),
    });

    yield delay( 10000);
  }
}
