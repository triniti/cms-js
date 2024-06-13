import React from 'react';
import Loading from '@triniti/cms/components/loading/index.js';
import useResolver from '@triniti/cms/components/with-pbj/useResolver.js';

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
