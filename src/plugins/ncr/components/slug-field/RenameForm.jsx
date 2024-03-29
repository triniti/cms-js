import React from 'react';
import { useDispatch } from 'react-redux';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import startCase from 'lodash-es/startCase';
import trimStart from 'lodash-es/trimStart';
import createSlug from '@gdbots/pbj/utils/createSlug';
import isValidSlug from '@gdbots/pbj/utils/isValidSlug';
import NodeRef from '@gdbots/pbj/well-known/NodeRef';
import { ActionButton, FormErrors, TextField, withForm } from 'components';
import renameNode from 'plugins/ncr/actions/renameNode';
import progressIndicator from 'utils/progressIndicator';
import toast from 'utils/toast';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';


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
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Rename {label}</ModalHeader>
      {hasSubmitErrors && <FormErrors errors={submitErrors} />}
      <ModalBody className="modal-scrollable">
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
          color="light"
          tabIndex="-1"
        />
        <ActionButton
          text={`Rename ${label}`}
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
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
