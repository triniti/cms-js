import React, { lazy, Suspense } from 'react';
import { ErrorBoundary, Loading } from '@triniti/cms/components/index.js';

const NodeHistoryCard = lazy(() => import('@triniti/cms/plugins/ncr/components/node-history-card/index.js'));

export default function HistoryTab(props) {
  const { tab } = props;
  if (tab !== 'history') {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <NodeHistoryCard {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
