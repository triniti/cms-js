import React from 'react';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import RawPbj from '@triniti/cms/components/raw-pbj';

export default function RawPbjModal(props) {
  return (
    <Modal centered isOpen size="lg" backdrop="static">
      <ModalHeader toggle={props.toggle}>Raw</ModalHeader>
      <ModalBody className="modal-scrollable p-0">
        <RawPbj pbj={props.pbj} />
      </ModalBody>
    </Modal>
  );
}
