import React, { lazy, Suspense } from 'react';
import { ErrorBoundary, Loading } from '@triniti/cms/components';

const NodeHistoryCard = lazy(() => import('@triniti/cms/plugins/ncr/components/node-history-card'));

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
