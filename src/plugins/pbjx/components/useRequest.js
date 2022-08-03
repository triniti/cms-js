import { useEffect, useState } from 'react';
import { getInstance } from '@app/main';
import * as constants from 'constants';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';

const makeRequest = async (request) => {
  const app = getInstance();
  const pbjx = await app.getPbjx();
  request
    .clear('request_id')
    .clear('occurred_at')
    .clear('ctx_retries')
    .clear('ctx_causator_ref')
    .clear('ctx_correlator_ref')
    .clear('ctx_user_ref');
  return await pbjx.request(await request.clone());
};

export default (request, runImmediately = false) => {
  const [response, setResponse] = useState();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(constants.STATUS_NONE);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!runImmediately && requestCount === 0) {
      return;
    }

    if (!request) {
      return;
    }

    let cancelled = false;
    setError(null);
    setStatus(constants.STATUS_PENDING);

    (async () => {
      if (cancelled) {
        return;
      }

      let newResponse;

      try {
        newResponse = await makeRequest(request);
      } catch (e) {
        if (cancelled) {
          return;
        }

        setError(getFriendlyErrorMessage(e));
        setStatus(constants.STATUS_FAILED);
        return;
      }

      if (cancelled) {
        return;
      }

      setError(null);
      setStatus(constants.STATUS_FULFILLED);
      setResponse(newResponse.freeze());
    })();

    return () => {
      cancelled = true;
    };
  }, [runImmediately, request, requestCount]);

  const isRunning = status === constants.STATUS_PENDING && response !== null;
  const run = () => setRequestCount(requestCount + 1);

  return {
    response,
    run,
    isRunning,
    pbjxError: error,
    pbjxStatus: status,
  };
};
