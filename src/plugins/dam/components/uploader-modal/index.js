import React, { useRef } from 'react';
import { Card, CardBody, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Swal from 'sweetalert2';
import noop from 'lodash-es/noop.js';
import { ActionButton } from '@triniti/cms/components/index.js';
import AssetForm from '@triniti/cms/plugins/dam/components/uploader-modal/AssetForm.js';
import Uploader from '@triniti/cms/plugins/dam/components/uploader-modal/Uploader.js';
import FileList from '@triniti/cms/plugins/dam/components/uploader-modal/FileList.js';
import useBatch from '@triniti/cms/plugins/dam/components/uploader-modal/useBatch.js';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';
import '@triniti/cms/plugins/dam/components/uploader-modal/styles.scss';

const okayToClose = async (msg = 'Files that haven\'t uploaded will be lost.', btn = 'OK, Close!') => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: msg,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: btn,
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  return !!result.value;
};

export default function UploaderModal(props) {
  const controlsRef = useRef({});
  const {
    onDone = noop,
    assetEnricher = noop,
    linkedRef,
    galleryRef,
    gallerySeqIncrementer = null
  } = props;
  const activeUpload = useRef();
  const batch = useBatch({ assetEnricher, linkedRef, galleryRef, gallerySeqIncrementer });
  const controls = controlsRef.current.delegate ? controlsRef.current : false;
  const upload = activeUpload.current ? batch.get(activeUpload.current) : null;

  const handleDone = async () => {
    if (batch.size === 0) {
      props.toggle();
      return;
    }

    if (batch.completed !== batch.size && !await okayToClose()) {
      return;
    }

    if (controls && controls.dirty && !await okayToClose(`Unsaved changes on ${upload.file.name} will be lost.`)) {
      return;
    }

    const asset = await (upload && upload.status === uploadStatus.COMPLETED ? upload.result : null);
    const assetRef = asset ? asset.generateNodeRef() : null;
    const assets = await Promise.all(batch.values()
      .filter(o => o.status === uploadStatus.COMPLETED)
      .map(o => o.result)
    );
    await onDone(assetRef, assets.map(a => a.generateNodeRef()));
    props.toggle();
  };

  const handleSelectUpload = async (nameHash) => {
    if (nameHash === activeUpload.current) {
      return;
    }

    if (!controls || !controls.dirty) {
      activeUpload.current = nameHash;
      batch.refresh();
      return;
    }

    const currentUpload = batch.get(activeUpload.current);
    if (currentUpload && !await okayToClose(`Unsaved changes on ${currentUpload.file.name} will be lost.`, 'OK')) {
      return;
    }

    activeUpload.current = nameHash;
    batch.refresh();
  };

  const handleUploadCompleted = (nameHash) => {
    if (activeUpload.current || activeUpload.current === nameHash) {
      return;
    }

    activeUpload.current = nameHash;
    batch.refresh();
  };

  const handleRemoveUpload = (nameHash) => {
    if (activeUpload.current === nameHash) {
      activeUpload.current = null;
    }

    batch.refresh();
  };

  return (
    <Modal isOpen backdrop="static" size="lg" centered>
      <ModalHeader toggle={handleDone}>Upload Files</ModalHeader>
      <ModalBody className="p-0 modal-scrollable">
        <div className="d-flex flex-column flex-md-row flex-nowrap">
          <div className="dam-col-start d-flex flex-column flex-fill flex-shrink-0">
            <Uploader
              {...props}
              batch={batch}
              onUploadCompleted={handleUploadCompleted}
              onRemoveUpload={handleRemoveUpload}
            />
            <div className="d-flex position-relative flex-fill">
              <FileList
                {...props}
                batch={batch}
                activeUpload={activeUpload.current}
                onSelectUpload={handleSelectUpload}
              />
            </div>
          </div>

          <Card className="dam-col-end flex-fill mb-0">
            <CardBody className="p-3 pb-0">
              {upload && (
                <AssetForm
                  batch={batch}
                  uploadHash={upload.nameHash}
                  controls={controlsRef}
                />
              )}
              {!upload && batch.size > 0 && (
                <p>Click a file <span className="d-none d-md-inline">on the left</span><span className="d-inline d-md-none">above</span> to edit.</p>
              )}
              {!upload && batch.size === 0 && (
                <p>Drop files <span className="d-none d-md-inline">on the left</span><span className="d-inline d-md-none">above</span>.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="ps-1 me-auto">
          {batch.size > 0 && (
            <>
              Uploaded {batch.completed} of {batch.size} items
            </>
          )}
        </div>
        <div className="ms-auto">
          {controls && upload && (
            <>
              {controls.dirty && (
                <ActionButton
                  text={`Save ${upload.file.name}`}
                  onClick={controls.delegate.handleSave}
                  icon="save-diskette"
                  color="primary"
                />
              )}
            </>
          )}
          <ActionButton
            text="Done"
            onClick={handleDone}
            icon="save"
            color="light"
          />
        </div>
      </ModalFooter>
    </Modal>
  );
}
