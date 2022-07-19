import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import createSlug from '@gdbots/pbj/utils/createSlug';
import { ActionButton, FormErrors, TextField, withForm, withPbj } from 'components';
import createNode from 'plugins/ncr/actions/createNode';
import progressIndicator from 'utils/progressIndicator';
import toast from 'utils/toast';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';
import nodeUrl from 'plugins/ncr/nodeUrl';

function CreatePromotionModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show('Creating Promotion...');

      values.slug = createSlug(values.title);
      await dispatch(createNode(values, form, pbj));

      props.toggle();
      await progressIndicator.close();
      await navigate(nodeUrl(pbj, 'edit'));
      toast({ title: 'Promotion Created.' });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Create Promotion</ModalHeader>
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
          text="Create Promotion"
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(CreatePromotionModal), '*:curator:node:promotion:v1');

export default function ModalWithNewNode(props) {
  return <ModalWithForm formName={`${APP_VENDOR}:promotion:new`} editMode {...props} />;
}
