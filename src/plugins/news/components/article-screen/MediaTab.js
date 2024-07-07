import React, { lazy, Suspense } from 'react';
import { ErrorBoundary, Loading } from '@triniti/cms/components/index.js';

const LinkedAssetsCard = lazy(() => import('@triniti/cms/plugins/dam/components/linked-assets-card/index.js'));

export default function MediaTab(props) {
  const { tab, nodeRef } = props;
  if (tab !== 'media') {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <LinkedAssetsCard linkedRef={nodeRef} />
      </ErrorBoundary>
    </Suspense>
  );
}
