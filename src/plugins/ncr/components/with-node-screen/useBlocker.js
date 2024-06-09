import { useContext, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';

// todo: remove once react-router re-implements useBlocker
// @link https://github.com/remix-run/react-router/issues/8139
export default (blocker, when = true) => {
  const { navigator } = useContext(NavigationContext);

  useEffect(() => {
    if (!when) {
      return;
    }

    const push = navigator.push;
    navigator.push = (...args) => {
      blocker(...args).then(shouldBlock => {
        if (shouldBlock) {
          return;
        }

        push(...args);
      }).catch(console.error);
    };

    return () => {
      navigator.push = push;
    };
  }, [navigator, blocker, when]);
};
