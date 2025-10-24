import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { addDateToSlug, createSlug, isValidSlug } from '@gdbots/pbj/utils/index.js';
import { ActionButton, FormErrors, TextField, withForm, withPbj } from '@triniti/cms/components/index.js';
import SeoTitleField from '@triniti/cms/plugins/common/components/seo-title-field/index.js';
import createNode from '@triniti/cms/plugins/ncr/actions/createNode.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import trimStart from 'lodash-es/trimStart.js';

// more restrictive DATED_SLUG_PATTERN than what gdbots/pbj does
const DATED_SLUG_PATTERN = /^\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+$/;
const isValidDatedSlug = value => isValidSlug(value, true) && DATED_SLUG_PATTERN.test(trimStart(value));

const parseDatedSlug = (value) => {
  let ending = '';
  if (value && (value.endsWith(' ') || value.endsWith('/') || value.endsWith('-'))) {
    ending = value[value.length - 1];
  }
  const slug = createSlug(value.toLowerCase(), true);
  return slug ? slug + ending : value;
};

const slugValidator = (value) => {
  const trimmedValue = value ? value.trim().replace(/\s+/g, '-') : value;
  if (isValidDatedSlug(trimmedValue)) {
    return undefined;
  }
  return 'Expected format YYYY/MM/DD/some-title-here';
};

function CreateArticleModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show('Creating Article...');
      if (values.slug && isValidDatedSlug(values.slug)) {
        values.slug = values.slug.toLowerCase();
      } else if (values.slug && !isValidDatedSlug(values.slug)) {
        values.slug = addDateToSlug(values.slug).toLowerCase();
      } else {
        values.slug = addDateToSlug(createSlug(values.title)).toLowerCase();
      }
      await dispatch(createNode(values, form, pbj));

      props.toggle();
      await progressIndicator.close();
      await navigate(nodeUrl(pbj, 'edit'));
      toast({ title: 'Article created.' });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  const handleBlur = (e) => {
    if (e.target.value) {
      form.change('slug', addDateToSlug(parseDatedSlug(e.target.value)));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && valid) {
      setTimeout(form.submit);
    }
  };

  return (
    <Modal isOpen centered backdrop="static">
      <ModalHeader toggle={props.toggle}>Create Article</ModalHeader>
      <ModalBody>
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <SeoTitleField onBlur={handleBlur} onKeyDown={handleKeyDown} />
          <TextField 
            name="slug" 
            label="Slug" 
            parse={parseDatedSlug}
            validator={slugValidator}
            onKeyDown={handleKeyDown}
          />
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
          type="submit"
          text="Create Article"
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          icon="plus-outline"
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(CreateArticleModal), '*:news:node:article:v1');

export default function ModalWithNewNode(props) {
  return <ModalWithForm editMode {...props} />;
}
