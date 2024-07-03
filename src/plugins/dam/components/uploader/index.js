import React, { useRef, useState } from 'react';
import { Card, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import Swal from 'sweetalert2';
import noop from 'lodash-es/noop.js';
import { ActionButton } from '@triniti/cms/components/index.js';
import AssetForm from '@triniti/cms/plugins/dam/components/uploader/AssetForm.js';
import Uploader from '@triniti/cms/plugins/dam/components/uploader/Uploader.js';
import FileList from '@triniti/cms/plugins/dam/components/uploader/FileList.js';
import useBatch from '@triniti/cms/plugins/dam/components/uploader/useBatch.js';
import '@triniti/cms/plugins/dam/components/uploader/styles.scss';
import { uploadStatus } from '@triniti/cms/plugins/dam/constants.js';

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
  const { onClose = noop, linkedRefs, galleryRef, gallerySequence = 0 } = props;
  const [activeUpload, setActiveUpload] = useState();
  const batch = useBatch({ linkedRefs, galleryRef, gallerySequence });
  const controls = controlsRef.current.delegate ? controlsRef.current : false;
  const upload = activeUpload ? batch.get(activeUpload) : null;

  const handleCloseModal = async () => {
    if (batch.size === 0) {
      onClose(null);
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
    onClose(asset);
    props.toggle();
  };

  const handleSelectUpload = async (hash) => {
    if (hash === activeUpload) {
      return;
    }

    if (!controls || !controls.dirty) {
      setActiveUpload(hash);
      return;
    }

    if (!await okayToClose(`Unsaved changes on ${upload.file.name} will be lost.`, 'OK')) {
      return;
    }

    setActiveUpload(hash);
  };

  const handleCloseUpload = () => {
    if (batch.has(activeUpload)) {
      batch.get(activeUpload).remove();
    }
    setActiveUpload(null); // select next one automatically?  eh
  };

  return (
    <Modal isOpen backdrop="static" size="lg" centered>
      <ModalHeader toggle={handleCloseModal}>Upload Files</ModalHeader>
      <ModalBody className="p-0 modal-scrollable">
        <div className="dam-uploader-wrapper">
          <div className="dam-content">
            <div className="dam-left-col">
              <div className="dam-drop-zone">
                <Uploader {...props} batch={batch} />
              </div>
              <div className="dam-file-queue">
                <FileList
                  {...props}
                  batch={batch}
                  activeUpload={activeUpload}
                  onSelectUpload={handleSelectUpload}
                />
              </div>
            </div>
            <div className="meta-form border-left">
              <Card className="pt-3 px-3 pb-1 mb-0">
                {activeUpload && (
                  <AssetForm
                    batch={batch}
                    uploadHash={activeUpload}
                    controls={controlsRef}
                    onRemoveUpload={handleCloseUpload}
                  />
                )}
                {!activeUpload && batch.size > 0 && (
                  <p>Click a file on the left to edit.</p>
                )}
                {!activeUpload && batch.size === 0 && (
                  <p>Drop files on the left.</p>
                )}
              </Card>
            </div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter className="p-0">
        <div className="align-self-start dam-pagination-col">
          {batch.size > 0 && (
            <>
              Uploaded {batch.completed} of {batch.size} items
            </>
          )}
        </div>
        <div className="ms-auto pe-3">
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
              {!controls.dirty && (
                <ActionButton
                  text={`Close ${upload.file.name}`}
                  onClick={handleCloseUpload}
                  icon="close-sm"
                  color="light"
                />
              )}
            </>
          )}
          <ActionButton
            text="Close"
            onClick={handleCloseModal}
            icon="close-sm"
            color="light"
            tabIndex="-1"
          />
        </div>
      </ModalFooter>
    </Modal>
  );
}
