import React, { Suspense } from 'react';
import { ErrorBoundary } from '@triniti/cms/components/index.js';

export default function BlocksmithModal(props) {
  const { isOpen = false, toggle, modal: ModalComponent, ...rest } = props;
  return (
    <div style={{position: 'fixed', bottom: 0, right: 0, width: '1px'}}>
      {isOpen && (
        <ErrorBoundary asModal toggle={toggle}>
          <Suspense fallback={<></>}>
            <ModalComponent toggle={toggle} {...rest} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
