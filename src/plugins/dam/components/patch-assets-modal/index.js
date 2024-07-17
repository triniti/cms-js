import React from 'react';
import { useDispatch } from 'react-redux';
import { FORM_ERROR } from 'final-form';
import noop from 'lodash-es/noop.js';
import { Alert, Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {
  ActionButton,
  DatePickerField,
  FormErrors,
  TextareaField,
  TextField,
  UrlField,
  withForm,
  withPbj
} from '@triniti/cms/components/index.js';
import patchAssets from '@triniti/cms/plugins/dam/actions/patchAssets.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';

function PatchAssetsModal(props) {
  const dispatch = useDispatch();

  const { delegate, form, formState, handleSubmit, nodes, onComplete = noop } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleSave = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show('Patching Assets...');
      const refs = nodes.map(node => node.generateNodeRef());
      await dispatch(patchAssets(refs, values));
      onComplete();
      props.toggle();
      await progressIndicator.close();
      toast({ title: 'Assets patched.' });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen centered backdrop="static">
      <ModalHeader toggle={props.toggle}>Patch Assets ({nodes.length})</ModalHeader>
      <ModalBody>
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Alert color="warning">
          Only the fields you edit below will be updated on {nodes.length} assets.
        </Alert>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField name="title" label="Title" />
          <TextField name="display_title" label="Display Title" />
          <DatePickerField name="expires_at" label="Expires At" />
          <TextField name="credit" label="Credit" />
          <UrlField name="credit_url" label="Credit URL" />
          <TextField name="cta_text" label="Call To Action" />
          <UrlField name="cta_url" label="Call To Action URL" />
          <TextareaField name="description" label="Description" rows={5} />
        </Form>
      </ModalBody>
      <ModalFooter>
        <ActionButton
          text="Cancel"
          onClick={props.toggle}
          icon="close-sm"
          color="light"
          tabIndex="-1"
        />
        <ActionButton
          text="Save"
          onClick={delegate.handleSave}
          disabled={submitDisabled}
          icon="save"
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(PatchAssetsModal), 'triniti:dam:command:patch-assets:v1');

export default function ModalWithNewCommand(props) {
  return <ModalWithForm editMode {...props} />;
}
