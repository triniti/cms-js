import React from 'react';
import Loading from 'components/loading';
import useResolver from 'plugins/pbjx/components/with-request/useResolver';

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
