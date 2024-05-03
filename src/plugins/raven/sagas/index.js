import { buffers } from 'redux-saga';
import { actionChannel, all, fork, select, take, takeLatest } from 'redux-saga/effects';
import { actionTypes } from '@triniti/cms/plugins/raven/constants.js';
import { actionTypes as appActionTypes } from '@triniti/cms/constants.js';
import { actionTypes as iamActionTypes } from '@triniti/cms/plugins/iam/constants.js';
import getAccessToken from '@triniti/cms/plugins/iam/selectors/getAccessToken.js';
import updateCollaborations from '@triniti/cms/plugins/raven/actions/updateCollaborations.js';
import updateConnectionStatus from '@triniti/cms/plugins/raven/actions/updateConnectionStatus.js';
import loadUser from '@triniti/cms/plugins/raven/actions/loadUser.js';
import isAuthenticated from '@triniti/cms/plugins/iam/selectors/isAuthenticated.js';
import isConnected from '@triniti/cms/plugins/raven/selectors/isConnected.js';
import getUserRef from '@triniti/cms/plugins/iam/selectors/getUserRef.js';
import ObjectSerializer from '@gdbots/pbj/serializers/ObjectSerializer.js';
import processEvent from '@triniti/cms/plugins/raven/actions/processEvent.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';

// This will hold worker instance
let worker = null;

const workerMessaged = (dispatch) => async ({ data }) => {
  const event = data?.event;
  switch (event) {
    case 'eventReceived': // When a change has happened on current node
      const { message } = data;
      const pbj = (await ObjectSerializer.deserialize(message)).freeze();
      dispatch(processEvent(pbj));
      break;
    case 'updateConnectionStatus':
      dispatch(updateConnectionStatus(data.status));
      break;
    case 'updateCollaborations':
      dispatch(updateCollaborations(data.collaborations));
      break;
    case 'loadUser':
      dispatch(loadUser(data.userRef));
      break;
    default:
      console.log('Raven: Uncaught from Saga:', data);
      break;
  }
};

const workerError = (dispatch) => (err) => {
  console.log('Raven Worker Error:', { err });
};

function* watchWorkersStarted() {
  yield takeLatest(
    appActionTypes.WORKERS_STARTED,
    function* workerFlow({ app }) {
      worker = app.getParameter('raven.worker');
      worker.addEventListener('message', workerMessaged(app.getRedux().dispatch));
      worker.addEventListener('error', workerError(app.getRedux().dispatch));
      const { hostname } = window.location;

      worker.postMessage({
        event: 'configure',
        payload: {
          apiEndpoint: API_ENDPOINT,
          appVendor: app.getParameter('app_vendor'),
          appName: app.getParameter('app_name'),
          appEnv: app.getParameter('app_env'),
          hostname,
        }
      });
    }
  );
}

function* watchUserLoaded() {
  yield takeLatest(
    iamActionTypes.USER_LOADED,
    function* connectFlow ({ user }) {
      const userRef = `${NodeRef.fromNode(user)}`;
      const accessToken = getAccessToken();
      const { href: currHref } = window.location;

      worker.postMessage({
        event: 'connect',
        payload: {
          accessToken,
          userRef,
          currHref,
        }
      });
    }
  );
}

function* watchUserLoggedOut() {
  yield takeLatest(
    iamActionTypes.LOGOUT_COMPLETED,
    function* disconnectFlow () {
      worker.postMessage({
        event: 'disconnect'
      });
    }
  );
}

function* publishFlow() {
  // add checks to make sure user is connected
  // or else drop messages.
  const channel = yield actionChannel(actionTypes.PUBLISH_MESSAGE_REQUESTED, buffers.sliding(20));
  while (true) {
    const action = yield take(channel);
    if (!(yield select(isAuthenticated))) {
      // message is dropped
      continue; // eslint-disable-line no-continue
    }

    const connected = yield select(isConnected);
    console.log('Publish flow connected status', { connected });
    // if (!connected) {
    //   yield take(connectsChannel);
    //   yield delay(1000);
    // }

    const userRef = yield select(getUserRef);
    const { message, topic } = action;

    // always tag the outgoing message with the user
    // so the subscribers know who sent it, McFly.
    message.user = `${userRef}`;

    // yield call([raven, 'publish'], message, topic);
    worker.postMessage({
      event: 'publish',
      payload: {
        message,
        topic,
      }
    });
    console.log('The action from PUBLISH FLOW', action);
  }
}

export default function* rootSaga() {
  yield all([
    /*
    fork(watchUserLoaded),
    fork(watchUserLoggedOut),
    fork(watchWorkersStarted),
    fork(publishFlow),
     */
  ]);
}
