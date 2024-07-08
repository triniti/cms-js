import React from 'react';
import startCase from 'lodash-es/startCase.js';
import { Form, Modal, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, FormErrors, withForm } from '@triniti/cms/components/index.js';
import useDelegate from '@triniti/cms/blocksmith/components/with-block-modal/useDelegate.js';

export default function withBlockModal(ModalBody, blockModalConfig = {}) {
  return withForm(function BlockModal(props) {
    const delegate = useDelegate(props);
    const { modalProps = {} } = blockModalConfig;
    const { formState, isFreshBlock, pbj } = props;
    const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
    const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);
    const label = startCase(pbj.schema().getQName().getMessage());

    return (
      <Modal isOpen backdrop="static" {...modalProps}>
        <ModalHeader toggle={props.toggle}>{`${isFreshBlock ? 'Add' : 'Update'} ${label}`}</ModalHeader>
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={delegate.handleSubmit} autoComplete="off">
          <div className="modal-scrollable">
            <ModalBody
              {...props}
              delegate={delegate}
              submitDisabled={submitDisabled}
            />
          </div>
        </Form>
        <ModalFooter>
          <ActionButton
            text="Cancel"
            onClick={props.toggle}
            color="light"
            tabIndex="-1"
          />
          <ActionButton
            text={`Save`}
            onClick={delegate.handleSave}
            disabled={submitDisabled}
            color="success"
          />
        </ModalFooter>
      </Modal>
    );
  });
}
