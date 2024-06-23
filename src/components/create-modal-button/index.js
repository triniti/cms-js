import React, { Suspense, useEffect, useRef, useState } from 'react';
import isFunction from 'lodash-es/isFunction.js';
import { ActionButton, ErrorBoundary } from '@triniti/cms/components/index.js';

export default function CreateModalButton(props) {
  const { color = 'light', modal: ModalComponent, modalProps = {}, keyCode, ...rest } = props;
  const [isOpen, setIsOpen] = useState(false);
  const isMounted = useRef(false);

  useEffect(() => {
    let listener;
    if (keyCode) {
      listener = (e) => {
        if (e.metaKey && e.keyCode === keyCode) {
          e.preventDefault();
          setIsOpen(true);
          return false;
        }
      };
      document.addEventListener('keydown', listener);
    }

    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (keyCode) {
        document.removeEventListener('keydown', listener);
      }
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

  const finalModalProps = isOpen && isFunction(modalProps) ? modalProps() : modalProps;

  return (
    <>
      <ActionButton color={color} onClick={toggle} {...rest} />
      {isOpen && (
        <ErrorBoundary asModal toggle={toggle}>
          <Suspense fallback={<></>}>
            <ModalComponent toggle={toggle} {...finalModalProps} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}
