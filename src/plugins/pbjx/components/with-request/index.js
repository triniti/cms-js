import React from 'react';
import Loading from '@triniti/cms/components/loading/index.js';
import useResolver from '@triniti/cms/plugins/pbjx/components/with-request/useResolver.js';

export { useResolver };

export default function withRequest(Component, curie, config) {
  return function ComponentWithRequest(props) {
    const request = useResolver(curie, config);

    if (!request) {
      return <Loading />;
    }

    return <Component {...props} pbj={request} request={request} />;
  };
}
