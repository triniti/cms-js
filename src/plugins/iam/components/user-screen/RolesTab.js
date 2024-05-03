import React, { lazy, Suspense } from 'react';
import { ErrorBoundary, Loading } from 'components';

const RolesForm = lazy(() => import('plugins/iam/components/user-screen/RolesForm'));

export default function RolesTab(props) {
  const { tab } = props;
  if (tab !== 'roles') {
    return null;
  }

  return (
    <Suspense fallback={<Loading />}>
      <ErrorBoundary>
        <RolesForm {...props} />
      </ErrorBoundary>
    </Suspense>
  );
}
