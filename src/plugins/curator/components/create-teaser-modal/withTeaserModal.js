import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { Form, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import startCase from 'lodash-es/startCase.js';
import { getInstance } from '@triniti/app/main.js';
import { ActionButton, FormErrors, withForm } from '@triniti/cms/components/index.js';
import progressIndicator from '@triniti/cms/utils/progressIndicator.js';
import toast from '@triniti/cms/utils/toast.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import createNode from '@triniti/cms/plugins/ncr/actions/createNode.js';
import getNode from '@triniti/cms/plugins/ncr/selectors/getNode.js';

const getContent = ref => getNode(getInstance().getRedux().getState(), ref);

export default function withTeaserModal(ModalFields) {
  return withForm(function TeaserModal(props) {
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
        const content = getContent(values.target_ref);
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
        <Form onSubmit={handleSubmit} autoComplete="off">
          <ModalBody className="modal-scrollable">
            {hasSubmitErrors && <FormErrors errors={submitErrors} />}
            <ModalFields {...props} />
          </ModalBody>
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
            icon="close-sm"
            color="light"
            tabIndex="-1"
          />
          <ActionButton
            text={`Create ${label}`}
            onClick={delegate.handleCreate}
            disabled={submitDisabled}
            icon="plus-outline"
            color="primary"
          />
        </ModalFooter>
      </>
    );
  });
}
