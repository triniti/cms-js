import React from 'react';
import { FORM_ERROR } from 'final-form';
import { getInstance } from '@triniti/app/main.js';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, EnumField, FormErrors, TextField, withForm } from '@triniti/cms/components/index.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import getRootFields from '@triniti/cms/utils/getRootFields.js';
import SlotRendering from '@triniti/schemas/triniti/curator/enums/SlotRendering.js';
import WidgetPickerField from '@triniti/cms/plugins/curator/components/widget-picker-field/index.js';

const filter = option => option.value !== 'unknown';

function SlotModal(props) {
  const { delegate, editMode, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleDone = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      const oldObj = FormMarshaler.marshal(pbj, { skipValidation: true });
      const paths = getRootFields(Object.keys(formState.dirtyFields));
      paths.forEach(path => delete oldObj[path]);
      const newObj = { ...oldObj, ...values };
      const newPbj = await FormMarshaler.unmarshal(newObj);

      if (!pbj.has('name') || !pbj.equals(newPbj)) {
        const app = getInstance();
        const pbjx = await app.getPbjx();
        await pbjx.triggerLifecycle(newPbj);
        // todo: review this modal closing during form update issue, seems jank
        setTimeout(() => {
          props.onSubmit(newPbj);
        });
      }

      props.toggle();
    } catch (e) {
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen centered backdrop="static">
      <ModalHeader toggle={props.toggle}>Slot</ModalHeader>
      <ModalBody>
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            name="name"
            label="Name"
            description="Location where this widget will render, e.g. html-head, header, footer."
            required
          />
          <EnumField
            enumClass={SlotRendering}
            name="rendering"
            label="Rendering"
            filter={filter}
            isClearable={false}
            required
          />
          <WidgetPickerField name="widget_ref" label="Widget" required />
        </Form>
      </ModalBody>
      <ModalFooter>
        {!editMode && <ActionButton text="Close" onClick={props.toggle} />}
        {editMode && (
          <>
            <ActionButton
              text="Cancel"
              onClick={props.toggle}
              icon="close-sm"
              color="light"
              tabIndex="-1"
            />
            <ActionButton
              text="Done"
              onClick={delegate.handleDone}
              disabled={submitDisabled}
              icon="save"
              color="primary"
            />
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withForm(SlotModal);

export default function ModalWithSlot(props) {
  return <ModalWithForm editMode {...props} />;
}
