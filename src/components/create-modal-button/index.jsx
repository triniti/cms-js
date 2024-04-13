import React, { Suspense, useEffect, useRef, useState } from 'react';
import { ActionButton, ErrorBoundary } from '@triniti/cms/components/index';

export default function CreateModalButton(props) {
  const { color = 'light', modal: ModalComponent, modalProps = {}, ...rest } = props;
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const toggle = (event) => {
    if (!isMounted.current) {
      return;
    }

    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    setIsOpen(!isOpen);
  }

  return (
    <>
      <ActionButton color={color} onClick={toggle} {...rest} />
      {isOpen && (
        <ErrorBoundary asModal toggle={toggle}>
          <Suspense fallback={<></>}>
            <ModalComponent toggle={toggle} {...modalProps} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}
