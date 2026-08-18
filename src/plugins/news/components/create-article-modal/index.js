import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, FormErrors, TextField, withForm, withPbj } from '@triniti/cms/components/index.js';
import SeoTitleField from '@triniti/cms/plugins/common/components/seo-title-field/index.js';
import createNode from '@triniti/cms/plugins/ncr/actions/createNode.js';
import { datedSlugValidator, formatDatedSlug, isValidDatedSlug } from '@triniti/cms/plugins/ncr/utils/slugFormat.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';

// Slug is optional on create — if left empty it's generated from the title on submit.
const slugValidator = (value) => {
  if (!value?.trim()) return undefined;
  return datedSlugValidator(value);
};

function CreateArticleModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // true once the user has typed directly in the slug field; false when we auto-fill it.
  const slugUserEdited = useRef(false);

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      progressIndicator.show('Creating Article...');
      const rawSlug = (values.slug ?? '').trim();
      const rawTitle = (values.title ?? '').trim();
      if (!rawSlug || !slugUserEdited.current) {
        // Slug is empty or was auto-filled — always generate fresh from the current title.
        values.slug = formatDatedSlug(rawTitle);
      } else {
        values.slug = isValidDatedSlug(rawSlug) ? rawSlug : formatDatedSlug(rawSlug);
      }
      if (rawTitle) values.title = rawTitle;
      await dispatch(createNode(values, form, pbj));

      props.toggle();
      progressIndicator.close();
      navigate(nodeUrl(pbj, 'edit'));
      toast({ title: 'Article created.' });
    } catch (e) {
      progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  const handleTitleBlur = (e) => {
    const titleValue = e.target.value.trim();
    if (titleValue !== e.target.value) {
      form.change('title', titleValue);
    }
    if (!titleValue) return;
    const currentSlug = form.getState().values.slug?.trim() ?? '';
    if (!currentSlug || !slugUserEdited.current) {
      slugUserEdited.current = false;
      form.change('slug', formatDatedSlug(titleValue));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && valid) {
      e.preventDefault();
      const { values } = form.getState();
      const currentSlug = values.slug?.trim() ?? '';
      if (!currentSlug || !slugUserEdited.current) {
        slugUserEdited.current = false;
        form.change('slug', formatDatedSlug((values.title ?? '').trim()));
      }
      form.submit();
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
            onInput={() => { slugUserEdited.current = true; }}
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
