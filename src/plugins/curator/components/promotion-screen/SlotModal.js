import React from 'react';
import { FORM_ERROR } from 'final-form';
import startCase from 'lodash-es/startCase';
import { getInstance } from '@triniti/app/main.js';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, EnumField, FormErrors, TextField, withForm } from '@triniti/cms/components/index.js';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';
import FormMarshaler from 'utils/FormMarshaler';
import getRootFields from 'utils/getRootFields';
import SlotRendering from '@triniti/schemas/triniti/curator/enums/SlotRendering';
import WidgetPickerField from 'plugins/curator/components/widget-picker-field';

const filter = option => option.value !== 'unknown';
const format = label => startCase(label.toLowerCase());

function SlotModal(props) {
  const { delegate, editMode, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleSave = form.submit;
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
        props.onSubmit(newPbj);
      }
      props.toggle();
    } catch (e) {
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Promotion Slot</ModalHeader>
      {hasSubmitErrors && <FormErrors errors={submitErrors} />}
      <ModalBody>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField label="Name" name="name" />
          <EnumField
            label="Rendering"
            name="rendering"
            enumClass={SlotRendering}
            filter={filter}
            format={format}
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
              color="light"
              tabIndex="-1"
            />
            <ActionButton
              text="Save"
              onClick={delegate.handleSave}
              disabled={submitDisabled}
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
  return <ModalWithForm formName={`${APP_VENDOR}:slot:new`} editMode {...props} />;
}
