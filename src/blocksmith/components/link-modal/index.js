import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton } from '@triniti/cms/components/index.js';

export default function LinkModal(props) {
  const [editor] = useLexicalComposerContext();

  const handleSubmit = () => {
  };

  return (
    <Modal isOpen backdrop="static" centered>
      <ModalHeader toggle={props.toggle}>Link</ModalHeader>
      <ModalBody className="modal-scrollable">
        <Form onSubmit={handleSubmit} autoComplete="off">
          <p>link</p>
        </Form>
      </ModalBody>
      <ModalFooter>
        <ActionButton text="Close" onClick={props.toggle} />
      </ModalFooter>
    </Modal>
  );
}
