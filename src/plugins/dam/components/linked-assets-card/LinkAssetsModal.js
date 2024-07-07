import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import noop from 'lodash-es/noop.js';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { useDispatch } from 'react-redux';
import { ActionButton, ErrorBoundary, Loading } from '@triniti/cms/components/index.js';
import SearchAssets from '@triniti/cms/plugins/dam/components/linked-assets-card/SearchAssets.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import linkAssets from '@triniti/cms/plugins/dam/actions/linkAssets.js';
import delay from '@triniti/cms/utils/delay.js';
import toast from '@triniti/cms/utils/toast.js';
import sendAlert from '@triniti/cms/actions/sendAlert.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';

const UploaderModal = lazy(() => import('@triniti/cms/plugins/dam/components/uploader/index.js'));

export default function LinkAssetsModal(props) {
  const {
    onClose = noop,
    linkedRef,
    uploaderProps = {},
  } = props;
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [refreshed, setRefreshed] = useState(0);
  const controlsRef = useRef(null);
  const batch = controlsRef.current ? controlsRef.current.batch : { size: 0 };
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      controlsRef.current = null;
    };
  }, []);

  const handleClose = () => {
    onClose();
    props.toggle();
  };

  const handleUploaderDone = (ref, refs) => {
    if (!refs || !refs.length) {
      if (uploaderOpen) {
        setUploaderOpen(false);
      }
      return;
    }

    onClose();
    props.toggle();
  };

  const handleUpload = () => {
    setUploaderOpen(true);
  };

  const handleLinkAssets = async () => {
    if (!controlsRef.current) {
      return;
    }

    try {
      await progressIndicator.show('Linking Assets...');
      const assetRefs = Array.from(batch.values()).map(n => n.generateNodeRef());
      await dispatch(linkAssets(linkedRef, assetRefs));
      await delay(3000); // merely here to allow for all assets to be updated in elastic search.

      if (controlsRef.current) {
        await controlsRef.current.run();
      }

      await progressIndicator.close();
      toast({ title: 'Assets linked.' });
    } catch (e) {
      await progressIndicator.close();
      dispatch(sendAlert({ type: 'danger', message: getFriendlyErrorMessage(e) }));
    }
  };

  const updateControls = (newBatch, run) => {
    controlsRef.current = { batch: newBatch, run };
    setRefreshed(refreshed + 1);
  };

  if (uploaderOpen) {
    return (
      <Suspense fallback={<Loading />}>
        <ErrorBoundary>
          <UploaderModal
            {...uploaderProps}
            linkedRef={linkedRef}
            onDone={handleUploaderDone}
            toggle={handleUploaderDone}
          />
        </ErrorBoundary>
      </Suspense>
    );
  }

  return (
    <Modal isOpen backdrop="static" size="xl" centered>
      <ModalHeader toggle={handleClose}>Link Assets</ModalHeader>
      <ModalBody className="p-0">
        <SearchAssets
          {...props}
          updateControls={updateControls}
          searchEnricher={req => req.set('q', req.get('q', '') + ` -linked_refs:${linkedRef}`)}
        />
      </ModalBody>

      <ModalFooter>
        <ActionButton
          text="Upload"
          onClick={handleUpload}
          color="primary"
          tabIndex="-1"
        />

        {batch.size > 0 && (
          <ActionButton
            text={`Link Assets (${batch.size})`}
            icon="link"
            color="primary"
            tabIndex="-1"
            onClick={handleLinkAssets}
          />
        )}

        <ActionButton
          text="Close"
          onClick={handleClose}
          icon="close-sm"
          color="light"
          tabIndex="-1"
        />
      </ModalFooter>
    </Modal>
  );
}
