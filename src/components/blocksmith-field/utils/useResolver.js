import isEmpty from 'lodash-es/isEmpty.js';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageResolver from '@gdbots/pbj/MessageResolver.js';
import clearRequest from '@triniti/cms/plugins/pbjx/actions/clearRequest.js';
import persistRequest from '@triniti/cms/plugins/pbjx/actions/persistRequest.js';
import getRequest from '@triniti/cms/plugins/pbjx/selectors/getRequest.js';
import noop from 'lodash-es/noop.js';

const defaultConfig = {
  channel: '',
  persist: false,
  initialData: {},
};

export default (curie, config = defaultConfig) => {
  const dispatch = useDispatch();
  const requestRef = useRef(null);
  const [resolved, setResolved] = useState(false);

  const myConfig = { ...defaultConfig, ...config };
  const initialData = useSelector((state) => {
    const data = getRequest(state, curie, myConfig.channel);
    if (isEmpty(data) && !isEmpty(myConfig.initialData)) {
      return myConfig.initialData;
    }

    return data;
  });

  useEffect(() => {
    if (resolved) {
      return noop;
    }

    let cancelled = false;

    (async () => {
      if (cancelled) {
        return;
      }

      let message;

      try {
        message = await MessageResolver.resolveCurie(curie);
      } catch (e) {
        console.error('with-request::useResolver unable to resolve curie', e, curie, myConfig);
        return;
      }

      if (cancelled) {
        return;
      }

      requestRef.current = await (initialData ? message.fromObject(initialData) : message.create());
      setResolved(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [curie, requestRef, setResolved]);

  useEffect(() => {
    return () => {
      if (!myConfig.persist || !requestRef.current) {
        dispatch(clearRequest(curie, myConfig.channel));
        return;
      }

      dispatch(persistRequest(requestRef.current, myConfig.channel));
    };
  }, []);

  return requestRef.current;
};
