import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import startCase from 'lodash-es/startCase.js';
import { Form, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, FormErrors, TextField, withForm } from '@triniti/cms/components/index.js';
import createNode from '@triniti/cms/plugins/ncr/actions/createNode.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

function CreateAppForm(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  const label = startCase(pbj.schema().getQName().getMessage());

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show(`Creating ${label}...`);
      await dispatch(createNode(values, form, pbj));
      props.toggle();
      await progressIndicator.close();
      await navigate(nodeUrl(pbj, 'edit'));
      toast({ title: `${label} created.` });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <>
      <ModalHeader>Create {label}</ModalHeader>
      {hasSubmitErrors && <FormErrors errors={submitErrors} />}
      <ModalBody className="modal-scrollable">
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField name="title" label="Title" required />
        </Form>
      </ModalBody>
      <ModalFooter>
        <ActionButton
          text="Back"
          onClick={props.onGoBack}
          color="hover-bg"
          tabIndex="-2"
        />
        <ActionButton
          text="Cancel"
          onClick={props.toggle}
          color="light"
          tabIndex="-1"
        />
        <ActionButton
          text={`Create ${label}`}
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          color="primary"
        />
      </ModalFooter>
    </>
  );
}

export default withForm(CreateAppForm);
