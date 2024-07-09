import React, { Suspense } from 'react';
import { ErrorBoundary, Loading } from '@triniti/cms/components/index.js';

export default function BlocksmithModal(props) {
  const { isOpen = false, toggle, modal: ModalComponent, ...rest } = props;
  return (
    <>
      {isOpen && (
        <ErrorBoundary asModal toggle={toggle}>
          <Suspense fallback={<Loading />}>
            <ModalComponent toggle={toggle} {...rest} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}
