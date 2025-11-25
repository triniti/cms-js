import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import RawPbj from '@triniti/cms/components/raw-pbj/index.js';

export default function RawPbjModal(props) {
  return (
    <Modal centered isOpen size="lg" toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>Raw</ModalHeader>
      <ModalBody className="modal-scrollable p-0">
        <RawPbj pbj={props.pbj} />
      </ModalBody>
    </Modal>
  );
}
