import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import noop from 'lodash-es/noop.js';

const STATUS_NONE = 'none';
const STATUS_RUNNING = 'running';
const STATUS_PAUSED = 'paused';
const STATUS_COMPLETED = 'completed';

export default (nodes, operation) => {
  const dispatch = useDispatch();
  const mountedRef = useRef(false);
  const controlsRef = useRef({});
  const statusRef = useRef(STATUS_NONE);
  const [queue, setQueue] = useState(nodes);
  const [results, setResults] = useState({});
  const [node, setNode] = useState(null);
  const [refreshed, setRefreshed] = useState(0);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const start = (event) => {
    event.stopPropagation();
    statusRef.current = STATUS_RUNNING;
    next();
  };

  const pause = (event) => {
    event.stopPropagation();
    if (statusRef.current === STATUS_PAUSED || statusRef.current !== STATUS_RUNNING) {
      return;
    }

    statusRef.current = STATUS_PAUSED;
    setRefreshed(refreshed + 1);
  };

  const resume = (event) => {
    event.stopPropagation();
    if (statusRef.current !== STATUS_PAUSED) {
      return;
    }

    statusRef.current = STATUS_RUNNING;
    setRefreshed(refreshed + 1);
    next();
  };

  const next = () => {
    if (statusRef.current === STATUS_COMPLETED || queue.length < 1) {
      statusRef.current = STATUS_COMPLETED;
      setRefreshed(refreshed + 1);
      return;
    }

    if (statusRef.current === STATUS_PAUSED) {
      return;
    }

    const [nextNode, ...nextQueue] = queue;
    const key = nextNode.generateNodeRef().toString();
    controlsRef.current.begin(key);
    setQueue(nextQueue);
    setNode(nextNode);
  };

  controlsRef.current.begin = (key) => {
    if (!mountedRef.current || results[key]) {
      return;
    }

    const nextResults = { ...results };
    nextResults[key] = { status: STATUS_RUNNING };
    setResults(nextResults);
  };

  controlsRef.current.complete = (node, ok, result) => {
    if (!mountedRef.current) {
      return;
    }

    const key = node.generateNodeRef().toString();
    const nextResults = { ...results };
    nextResults[key].status = STATUS_COMPLETED;
    nextResults[key].ok = !!ok;
    nextResults[key].result = result;
    setResults(nextResults);
    setNode(null);
    next();
  };

  useEffect(() => {
    if (!node || !mountedRef.current) {
      return noop;
    }

    let cancelled = false;
    const run = async () => {
      if (cancelled || !mountedRef.current) {
        return;
      }

      try {
        const result = await operation(dispatch, node);
        controlsRef.current.complete(node, true, result);
      } catch (e) {
        controlsRef.current.complete(node, false, getFriendlyErrorMessage(e));
      }
    };

    run().then().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [node]);

  return {
    start,
    pause,
    resume,
    results,
    getResults: (key) => {
      if (!results[key]) {
        return { status: STATUS_NONE, ok: false, result: '' };
      }

      return results[key];
    },
    isPaused: statusRef.current === STATUS_PAUSED,
    isStarted: statusRef.current !== STATUS_NONE,
    isRunning: statusRef.current === STATUS_RUNNING,
    isCompleted: statusRef.current === STATUS_COMPLETED,
  };
};
