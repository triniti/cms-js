import React, { useRef, useState } from 'react';
import { Card, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import noop from 'lodash-es/noop.js';
import startCase from 'lodash-es/startCase.js';
import { ActionButton } from '@triniti/cms/components/index.js';

export default function ImagePickerModal(props) {
  const controlsRef = useRef({});
  const { onDone = noop, linkedRef, label } = props;
  const [activeUpload, setActiveUpload] = useState();

  const handleDone = () => {
    onDone('tcd:image-asset:image_jpg_20240703_3152be3786ea45928253681c379a5df1');
    props.toggle();
  };

  return (
    <Modal isOpen backdrop="static" size="lg" centered>
      <ModalHeader toggle={handleDone}>Select {startCase(label)}</ModalHeader>
      <ModalBody className="modal-scrollable">
        <p>stuff</p>
      </ModalBody>

      <ModalFooter>
        <ActionButton
          text="Done"
          onClick={handleDone}
          icon="save"
          color="primary"
          tabIndex="-1"
        />
      </ModalFooter>
    </Modal>
  );
}
