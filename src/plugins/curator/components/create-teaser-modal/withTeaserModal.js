import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FORM_ERROR } from 'final-form';
import { Form, ModalFooter, ModalHeader } from 'reactstrap';
import startCase from 'lodash-es/startCase';
import { getInstance } from '@triniti/app/main.js';
import { ActionButton, FormErrors, withForm } from 'components';
import progressIndicator from 'utils/progressIndicator';
import toast from 'utils/toast';
import getFriendlyErrorMessage from 'plugins/pbjx/utils/getFriendlyErrorMessage';
import nodeUrl from 'plugins/ncr/nodeUrl';
import createNode from 'plugins/ncr/actions/createNode';
import getNode from 'plugins/ncr/selectors/getNode';

const getContent = ref => getNode(getInstance().getRedux().getState(), ref);

export default function withTeaserModal(ModalBody) {
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
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <ModalBody
            {...props}
            className="modal-scrollable"
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
