import React from 'react';
import {
  Button,
  Card,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import noop from 'lodash-es/noop.js';
import swal from 'sweetalert2';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { TextField, TextareaField, DatePickerField } from '@triniti/cms/components/index.js';
import { FormGroup, Col, Row } from 'reactstrap';
import PicklistField from '@triniti/cms/plugins/sys/components/picklist-field';
import { getInstance } from '@triniti/app/main.js';
import MessageResolver from '@gdbots/pbj/MessageResolver';
import sendAlert from 'actions/sendAlert';
import { useDispatch } from 'react-redux';

import './styles.scss';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { fromNodeRef } from '@triniti/cms/plugins/dam/utils/assetFactory';

const confirmDone = async (text) => {
  return swal.fire({
    cancelButtonClass: 'btn btn-secondary',
    confirmButtonClass: 'btn btn-danger',
    confirmButtonText: 'Yes',
    showCancelButton: true,
    text,
    title: 'Are you sure?',
    icon: 'warning',
    reverseButtons: true,
  });
};

const patchAssets =  async (form, dispatch, nodeRefs) => {
  const app = getInstance();
  const pbjx = await app.getPbjx();
  const PatchAssetsV1 = await MessageResolver.resolveCurie(`${APP_VENDOR}:dam:command:patch-assets:v1`);
  const paths = [];
  const command = PatchAssetsV1.create();
  form.getRegisteredFields().map(field => {
    const value = form.getFieldState(field).value;
    if (value) {
      command.set(field, field === 'expires_at' ? new Date(value) : value);
      paths.push(field);
    }
  });

  const nodeRefObjects = [];
  for (let i = 0; i < nodeRefs.length; i++) {
    const asset = await fromNodeRef(nodeRefs[i]);
    nodeRefObjects.push(NodeRef.fromNode(asset));
  }

  command
    .addToSet('node_refs', nodeRefObjects)
    .addToSet('paths', paths);
  await pbjx.send(command);

  dispatch(sendAlert({
    type: 'success',
    isDismissible: true,
    delay: 1000,
    message: 'Assets updated.',
  }));
}

const BatchEdit = ({
  assetIds,
  isOpen = false,
  onToggleBatchEdit,
  onAfterBatchEdit = noop,
}) => {
  const dispatch = useDispatch();

  const handleToggleUploader = dirty => () => {
    if (dirty) {
      const confirmText = 'Do you want to leave the form without saving?';
      confirmDone(confirmText).then(({ value }) => {
        if (value) {
          onToggleBatchEdit();
        } else {
          // do nothing, user declined
        }
      });
    } else {
      onToggleBatchEdit();
    }
  }

  const handleUpdate = async (form) => {
    await patchAssets(form, dispatch, assetIds);
    onToggleBatchEdit();
    onAfterBatchEdit();
  }

  return (
    <Form
      autoComplete="off"
      mutators={{ ...arrayMutators }}
      onSubmit={noop}
      keepDirtyOnReinitialize={false}
      render={({ dirty, form, valid }) => (
        <Modal isOpen={isOpen} toggle={handleToggleUploader(dirty)} size="md" className='modal-dialog-centered'>
          <ModalHeader toggle={handleToggleUploader(dirty)}>
            Batch Edit
          </ModalHeader>
          <ModalBody>
            <Card>
              <Row>
                <Col>
                  <FormGroup>
                    <TextField name="title" label="Title" size="sm" />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="gutter-sm">
                <Col>
                  <FormGroup>
                    <PicklistField name="credit" label="Credit" picklist="image-asset-credits" />
                  </FormGroup>
                </Col>
              </Row>
              <Row className="gutter-sm">
                <Col>
                  <DatePickerField
                    name="expires_at"
                    label="Expires At"
                    showTimeSelect={false}
                    dateFormat={'MM/dd/yyyy'}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup className="mb-3">
                    <TextareaField name="description" label="Description" />
                  </FormGroup>
                </Col>
              </Row>
            </Card>
            <p style={{ textAlign: 'right', marginTop: '1em' }}><em>*Only edited fields are updated.</em></p>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={form.reset}
              disabled={!dirty}
            >
              Reset
            </Button>

            <Button
              onClick={() => handleUpdate(form)}
              disabled={!valid || !dirty}
            >
              Update
            </Button>

            <Button
              onClick={handleToggleUploader(dirty)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      )}
    />
  );
}

export default BatchEdit;
