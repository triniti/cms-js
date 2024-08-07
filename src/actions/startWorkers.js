import { actionTypes } from '@triniti/cms/constants.js';
import publishEvent from '@triniti/cms/plugins/raven/actions/publishEvent.js';
import { actionTypes as ravenActionTypes } from '@triniti/cms/plugins/raven/constants.js';

const start = { method: 'start', appEnv: APP_ENV, apiEndpoint: API_ENDPOINT };

export default (app, workers) => (dispatch) => {
  const onMessage = (event) => {
    const action = event.data || {};
    if (!action.type) {
      // ignore, worker is emitting a message we don't process
      return;
    }

    if (action.type === ravenActionTypes.PUBLISH_EVENT) {
      dispatch(publishEvent(event.target, action));
      return;
    }

    dispatch(action);
  };

  for (const [key, worker] of Object.entries(workers)) {
    worker.addEventListener('message', onMessage);
    worker.postMessage(start);
    app.set(`${key}/${key}_worker`, worker);
  }

  return { type: actionTypes.WORKERS_STARTED, app, workers };
};
