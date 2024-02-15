import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { addDateToSlug, createSlug } from '@gdbots/pbj/utils';
import { ActionButton, FormErrors, TextField, withForm, withPbj } from 'components';
import createNode from 'plugins/ncr/actions/createNode';
import progressIndicator from 'utils/progressIndicator';
import toast from 'utils/toast';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';
import nodeUrl from 'plugins/ncr/nodeUrl';
import isValidSlug from '@gdbots/pbj/utils/isValidSlug';
import trimStart from 'lodash-es/trimStart';

// more restrictive DATED_SLUG_PATTERN than what gdbots/pbj does
const DATED_SLUG_PATTERN = /^\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+$/;
const validDatedSlug = value => isValidSlug(value, true) && DATED_SLUG_PATTERN.test(trimStart(value)) ? true : false;

function CreateGalleryModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [slug, setSlug] = useState('');

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show('Creating Gallery...');
      if(slug && validDatedSlug(slug)){
        values.slug = slug;
      }else if(slug && !validDatedSlug(slug)){
        values.slug = addDateToSlug(slug);
      } else {
        values.slug =  addDateToSlug(createSlug(values.title, true));
      }
      await dispatch(createNode(values, form, pbj));
      props.toggle();
      await progressIndicator.close();
      await navigate(nodeUrl(pbj, 'edit'));
      toast({ title: 'Gallery created.' });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  const handleBlur = e => {
    if(e.target.value && !slug) {
      setSlug(addDateToSlug(createSlug(e.target.value, true)));
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && e.target.value && !slug) {
      setSlug(addDateToSlug(createSlug(e.target.value, true)));
    }
  }

  const handleChange = e => {
    setSlug(e.target.value);
  }

  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Create Gallery</ModalHeader>
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
          text="Create Gallery"
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(CreateGalleryModal), '*:curator:node:gallery:v1');

export default function ModalWithNewNode(props) {
  return <ModalWithForm formName={`${APP_VENDOR}:gallery:new`} editMode {...props} />;
}
