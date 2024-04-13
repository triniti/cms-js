import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import createSlug from '@gdbots/pbj/utils/createSlug';
import { ActionButton, FormErrors, TextField, withForm, withPbj } from '@triniti/cms/components';
import createNode from '@triniti/cms/plugins/ncr/actions/createNode';
import progressIndicator from '@triniti/cms/utils/progressIndicator';
import toast from '@triniti/cms/utils/toast';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl';

function CreatePersonModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show('Creating Person...');
      values.slug = createSlug(values.title);
      await dispatch(createNode(values, form, pbj));
      props.toggle();
      await progressIndicator.close();
      await navigate(nodeUrl(pbj, 'edit'));
      toast({ title: 'Person created.' });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Create Person</ModalHeader>
      {hasSubmitErrors && <FormErrors errors={submitErrors} />}
      <ModalBody className="modal-scrollable">
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField name="title" label="Title" required />
        </Form>
      </ModalBody>
      <ModalFooter>
        <ActionButton
          text="Cancel"
          onClick={props.toggle}
          color="light"
          tabIndex="-1"
        />
        <ActionButton
          text="Create Person"
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(CreatePersonModal), '*:people:node:person:v1');

export default function ModalWithNewNode(props) {
  return <ModalWithForm formName={`${APP_VENDOR}:person:new`} editMode {...props} />;
}
