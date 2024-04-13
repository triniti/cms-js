import { useEffect, useRef, useState } from 'react';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import noop from 'lodash-es/noop';

export default (curie, initialData = {}) => {
  const pbjRef = useRef(null);
  const [resolved, setResolved] = useState(false);

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
        console.error('with-pbj::useResolver use unable to resolve curie', e, curie, initialData);
        return;
      }

      if (cancelled) {
        return;
      }

      pbjRef.current = await message.fromObject(initialData);
      setResolved(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [curie, pbjRef, setResolved]);

  return pbjRef.current;
};
