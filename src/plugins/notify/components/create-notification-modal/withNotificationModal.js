import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormState } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { Form, ModalFooter, ModalHeader } from 'reactstrap';
import startCase from 'lodash-es/startCase';
import { getInstance } from '@triniti/app/main.js';
import { ActionButton, FormErrors, withForm } from '@triniti/cms/components/index.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import createNode from '@triniti/cms/plugins/ncr/actions/createNode.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode';

const getContent = ref => getNode(getInstance().getRedux().getState(), ref);

export default function withNotificationModal(ModalBody) {
  return withForm(function NotificationModal(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { appRef, delegate, form, formState, handleSubmit, pbj } = props;
    const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
    const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

    const label = startCase(pbj.schema().getQName().getMessage());
    const { values } = useFormState({ subscription: { values: true } });
    const articleStatus = values.content_ref && getContent(values.content_ref).get('status').value;

    delegate.handleCreate = form.submit;
    delegate.handleSubmit = async (values) => {
      try {
        await progressIndicator.show(`Creating ${label}...`);

        values.app_ref = appRef;
        const content = getContent(values.content_ref);
        if (content) {
          values.title = content.get('title');
        }

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
        <Form onSubmit={handleSubmit} autoComplete="off">
          <ModalBody
            {...props}
            className="modal-scrollable"
            articleStatus={articleStatus}
            delegate={delegate}
            submitDisabled={submitDisabled}
          />
        </Form>
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
  });
}
