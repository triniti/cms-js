import React, { Suspense } from 'react';
import { ErrorBoundary, Loading } from '@triniti/cms/components/index.js';

// todo: matt, to avoid UI jank i positioned the div here
// not sure if best strategy so just noting here
export default function BlocksmithModal(props) {
  const { isOpen = false, toggle, modal: ModalComponent, ...rest } = props;
  return (
    <div style={{position: 'fixed', top: 0, left: 0, width: '1px'}}>
      {isOpen && (
        <ErrorBoundary asModal toggle={toggle}>
          <Suspense fallback={<Loading />}>
            <ModalComponent toggle={toggle} {...rest} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
