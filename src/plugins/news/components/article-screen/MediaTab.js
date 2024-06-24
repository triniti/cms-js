import React, { lazy, Suspense } from 'react';
import { ErrorBoundary, Loading } from '@triniti/cms/components/index.js';

const LinkedMediaCard = lazy(() => import('@triniti/cms/plugins/dam/components/linked-images-tab/index.js'));

export default function MediaTab(props) {
  const { tab, nodeRef } = props;
  if (tab !== 'media') {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <LinkedMediaCard nodeRef={nodeRef} />
      </ErrorBoundary>
    </Suspense>
  );
}
