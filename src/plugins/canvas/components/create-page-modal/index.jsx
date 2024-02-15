import React, { useState } from 'react';
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

function CreatePageModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show('Creating Page...');
      values.slug = slug ?? createSlug(values.title);
      await dispatch(createNode(values, form, pbj));
      props.toggle();
      await progressIndicator.close();
      await navigate(nodeUrl(pbj, 'edit'));
      toast({ title: 'Page Created.' });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  const handleBlur = e => {
    if(e.target.value && !slug) {
      setSlug(createSlug(e.target.value));
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && e.target.value && !slug) {
      setSlug(createSlug(e.target.value));
    }
  }

  const handleChange = e => {
    setSlug(e.target.value);
  }

  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Create Page</ModalHeader>
      {hasSubmitErrors && <FormErrors errors={submitErrors} />}
      <ModalBody className="modal-scrollable">
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField name="title" label="Title" onBlur={handleBlur} onKeyDown={handleKeyDown} required />
          <TextField name="slug" label="Slug" value={slug} onChange={handleChange} />
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
          text="Create Page"
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(CreatePageModal), '*:canvas:node:page:v1');

export default function ModalWithNewNode(props) {
  return <ModalWithForm formName={`${APP_VENDOR}:page:new`} editMode {...props} />;
}
