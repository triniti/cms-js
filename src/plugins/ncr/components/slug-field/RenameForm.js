import React from 'react';
import { useDispatch } from 'react-redux';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import startCase from 'lodash-es/startCase.js';
import trimStart from 'lodash-es/trimStart.js';
import createSlug from '@gdbots/pbj/utils/createSlug.js';
import isValidSlug from '@gdbots/pbj/utils/isValidSlug.js';
import NodeRef from '@gdbots/pbj/well-known/NodeRef.js';
import { ActionButton, FormErrors, TextField, withForm } from '@triniti/cms/components/index.js';
import renameNode from '@triniti/cms/plugins/ncr/actions/renameNode.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';


// more restrictive DATED_SLUG_PATTERN than what gdbots/pbj does
const DATED_SLUG_PATTERN = /^\d{4}\/\d{2}\/\d{2}\/[a-z0-9-]+$/;

const slugValidator = value => isValidSlug(value) ? undefined : 'Only use letters, numbers and dashes.';
const datedSlugValidator = (value) => {
  if (isValidSlug(value, true) && DATED_SLUG_PATTERN.test(trimStart(value))) {
    return undefined;
  }

  return 'Slug requires date, e.g. YYYY/MM/DD/some-title';
}


function RenameForm(props) {
  const dispatch = useDispatch();

  const {
    delegate,
    form,
    formState,
    handleSubmit,
    onRenamed,
    pbj,
    nodeRef,
    qname,
    withDatedSlug = false
  } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);
  const label = startCase(qname.getMessage());

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show(`Renaming ${label}...`);

      const oldSlug = pbj.get('slug');
      const newSlug = createSlug(values.slug || '', withDatedSlug);

      if (oldSlug !== newSlug) {
        await dispatch(renameNode(nodeRef, oldSlug, newSlug));
      }

      onRenamed(newSlug);
      props.toggle();
      await progressIndicator.close();
      toast({ title: `${label} renamed.` });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  // todo: add inline alert about 404 when renaming a published node

  return (
    <Modal isOpen centered backdrop="static">
      <ModalHeader toggle={props.toggle}>Rename {label}</ModalHeader>
      <ModalBody>
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField
            name="slug"
            label="New Slug"
            required
            validator={withDatedSlug ? datedSlugValidator : slugValidator}
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
          text={`Rename ${label}`}
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          icon="save-diskette"
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withForm(RenameForm);

export default function ModalWithNode(props) {
  const nodeRef = NodeRef.fromString(`${props.nodeRef}`);
  return <ModalWithForm formName={`${props.nodeRef}:rename`} editMode qname={nodeRef.getQName()} {...props} />;
}
