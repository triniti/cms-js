import React from 'react';
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

const slugValidator = (value) => {
  if (isValidDatedSlug(value)) {
    return undefined;
  }
  return 'Expected format YYYY/MM/DD/some-title-here';
};

/** Normalizes to a valid dated slug with no trailing space/dash/slash so validation passes. */
const formatDatedSlug = (value) => {
  const trimmed = (value ?? '').trim().toLowerCase();
  const slug = createSlug(trimmed, true);
  const dated = slug ? addDateToSlug(slug).toLowerCase() : '';
  return dated || trimmed;
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

  const handleTitleBlur = (e) => {
    const titleValue = (e.target.value ?? '').trim();
    if (titleValue !== (e.target.value ?? '')) {
      form.change('title', titleValue);
    }
    if (!titleValue) return;
    const currentSlug = form.getState().values.slug;
    const hasSlug = typeof currentSlug === 'string' && currentSlug.trim().length > 0;
    if (!hasSlug) {
      form.change('slug', formatDatedSlug(titleValue));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && valid) {
      setTimeout(form.submit);
    }
  };

  return (
    <Modal isOpen centered toggle={props.toggle}>
      <ModalHeader toggle={props.toggle}>Create Article</ModalHeader>
      <ModalBody>
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <SeoTitleField onBlur={handleTitleBlur} onKeyDown={handleKeyDown} />
          <TextField
            name="slug"
            label="Slug"
            format={formatDatedSlug}
            formatOnBlur
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
