import isEmpty from 'lodash-es/isEmpty';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import clearRequest from 'plugins/pbjx/actions/clearRequest';
import persistRequest from 'plugins/pbjx/actions/persistRequest';
import getRequest from 'plugins/pbjx/selectors/getRequest';
import noop from 'lodash/noop';

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
