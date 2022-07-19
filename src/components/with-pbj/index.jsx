import React from 'react';
import Loading from 'components/loading';
import useResolver from 'components/with-pbj/useResolver';

export { useResolver };

export default function withPbj(Component, curie, initialData = {}) {
  return function ComponentWithPbj(props) {
    const pbj = useResolver(curie, initialData);

    if (!pbj) {
      return <Loading fixed/>;
    }

    return <Component {...props} pbj={pbj} />;
  };
}
