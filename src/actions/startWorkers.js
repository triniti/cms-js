import { actionTypes } from '@triniti/cms/constants.js';
import dispatchPbj from '@triniti/cms/plugins/raven/actions/dispatchPbj.js';

const start = { method: 'start', appEnv: APP_ENV, apiEndpoint: API_ENDPOINT };

export default (app, workers) => (dispatch) => {
  const onMessage = (event) => {
    const data = event.data || {};
    if (!data.type && !data._schema) {
      // ignore, worker is emitting a message we don't process
      return;
    }

    if (data._schema) {
      dispatch(dispatchPbj(event.target, data));
      return;
    }

    dispatch(data);
  };

  for (const [key, worker] of Object.entries(workers)) {
    worker.addEventListener('message', onMessage);
    worker.postMessage(start);
    app.set(`${key}_worker`, worker);
  }

  return { type: actionTypes.WORKERS_STARTED, app, workers };
};
