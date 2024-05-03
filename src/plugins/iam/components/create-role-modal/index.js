import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import createSlug from '@gdbots/pbj/utils/createSlug';
import RoleId from '@gdbots/schemas/gdbots/iam/RoleId';
import { ActionButton, FormErrors, TextField, withForm, withPbj } from '@triniti/cms/components/index.js';
import createNode from 'plugins/ncr/actions/createNode';
import progressIndicator from 'utils/progressIndicator';
import toast from 'utils/toast';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';
import nodeUrl from 'plugins/ncr/nodeUrl';


const titleValidator = value => createSlug(value) ? undefined : 'Only use letters, numbers and dashes.';

function CreateRoleModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  useEffect(() => {
    const id = formState.values.title ? createSlug(formState.values.title) : null;
    if (id) {
      pbj.set('_id', RoleId.fromString(id));
    }
  }, [pbj, formState.values.title]);

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show('Creating Role...');

      const id = createSlug(values.title);
      values._id = id;
      values.title = id;
      pbj.set('_id', RoleId.fromString(id));
      await dispatch(createNode(values, form, pbj));

      props.toggle();
      await progressIndicator.close();
      await navigate(nodeUrl(pbj, 'edit'));
      toast({ title: 'Role created.' });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Create Role</ModalHeader>
      {hasSubmitErrors && <FormErrors errors={submitErrors} />}
      <ModalBody className="modal-scrollable">
        <Form onSubmit={handleSubmit} autoComplete="off">
          <TextField name="title" label="Title" required validator={titleValidator} />
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
          text="Create Role"
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(CreateRoleModal), '*:iam:node:role:v1');

export default function ModalWithNewNode(props) {
  return <ModalWithForm formName={`${APP_VENDOR}:role:new`} editMode {...props} />;
}
