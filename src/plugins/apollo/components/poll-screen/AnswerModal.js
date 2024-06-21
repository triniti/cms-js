import React from 'react';
import { FORM_ERROR } from 'final-form';
import { getInstance } from '@triniti/app/main.js';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, FormErrors, NumberField, TextField, UrlField, withForm } from '@triniti/cms/components/index.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import getRootFields from '@triniti/cms/utils/getRootFields.js';

function AnswerModal(props) {
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

      if (!pbj.has('title') || !pbj.equals(newPbj)) {
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
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Poll Answer</ModalHeader>
      {hasSubmitErrors && <FormErrors errors={submitErrors} />}
      <ModalBody>
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField name="title" label="Title" />
          <UrlField name="url" label="URL" />
          <NumberField name="initial_votes" label="Initial Votes" />
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

const ModalWithForm = withForm(AnswerModal);

export default function ModalWithAnswer(props) {
  return <ModalWithForm formName={`${APP_VENDOR}:poll-answer:new`} editMode {...props} />;
}
