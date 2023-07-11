import { useEffect, useRef, useState } from 'react';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import noop from 'lodash/noop';

export default (mixin, withMajor = false) => {
  const curiesRef = useRef(null);
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

      let curies;

      try {
        curies = await MessageResolver.findAllUsingMixin(mixin, withMajor);
      } catch (e) {
        console.error('useCuries was unable to resolve mixin', e, mixin, withMajor);
        return;
      }

      if (cancelled) {
        return;
      }

      curiesRef.current = curies;
      setResolved(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [mixin, withMajor, setResolved]);

  return curiesRef.current;
};
