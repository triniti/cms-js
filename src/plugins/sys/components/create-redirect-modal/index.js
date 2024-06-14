import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import trim from 'lodash-es/trim.js';
import RedirectId from '@triniti/schemas/triniti/sys/RedirectId.js';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, FormErrors, SwitchField, UriField, withForm, withPbj } from '@triniti/cms/components/index.js';
import createNode from '@triniti/cms/plugins/ncr/actions/createNode.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';

function CreateRedirectModal(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  useEffect(() => {
    const uri = formState.values.title || null;
    const id = uri ? RedirectId.fromUri(uri) : null;
    if (id) {
      pbj.set('_id', id);
    }
  }, [pbj, formState.values.title]);

  delegate.handleCreate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      await progressIndicator.show('Creating Redirect...');

      const uri = '/' + trim(values.title, '/');
      const id = RedirectId.fromUri(uri);
      values._id = id.toString();
      values.title = uri;
      pbj.set('_id', id);

      if (trim(uri, '/') === trim(values.redirect_to, '/')) {
        await progressIndicator.close();
        return { [FORM_ERROR]: 'Request URI and destination cannot be the same.' };
      }

      await dispatch(createNode(values, form, pbj));
      props.toggle();
      await progressIndicator.close();
      await navigate(nodeUrl(pbj, 'edit'));
      toast({ title: 'Redirect created.' });
    } catch (e) {
      await progressIndicator.close();
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Create Redirect</ModalHeader>
      {hasSubmitErrors && <FormErrors errors={submitErrors} />}
      <ModalBody className="modal-scrollable">
        <Form onSubmit={handleSubmit} autoComplete="off">
          <UriField name="title" label="Request URI" required />
          <UriField name="redirect_to" label="Redirect URI" required />
          <SwitchField name="is_vanity" label="Is Vanity URL?" />
          <SwitchField name="is_permanent" label="Is Permanent?" />
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
          text="Create Redirect"
          onClick={delegate.handleCreate}
          disabled={submitDisabled}
          icon="plus-outline"
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

const ModalWithForm = withPbj(withForm(CreateRedirectModal), '*:sys:node:redirect:v1');

export default function ModalWithNewNode(props) {
  return <ModalWithForm formName={`${APP_VENDOR}:redirect:new`} editMode {...props} />;
}
