import { useEffect, useState } from 'react';
import noop from 'lodash-es/noop.js';
import { getInstance } from '@triniti/app/main.js';
import * as constants from '@triniti/cms/constants.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';

const makeRequest = async (request, enricher) => {
  const app = getInstance();
  const pbjx = await app.getPbjx();
  request
    .clear('request_id')
    .clear('occurred_at')
    .clear('ctx_retries')
    .clear('ctx_causator_ref')
    .clear('ctx_correlator_ref')
    .clear('ctx_user_ref');
  const newRequest = await request.clone();
  await enricher(newRequest, app);
  return await pbjx.request(newRequest);
};

export default (request, runImmediately = true, enricher = noop) => {
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
        newResponse = await makeRequest(request, enricher);
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
