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

const getTarget = ref => getNode(getInstance().getRedux().getState(), ref);

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
        const target = getTarget(values.target_ref);
        if (target) {
          const targetSchema = target.schema();
          values.sync_with_target = true;
          values.title = target.get('display_title', target.get('title'));

          if (target.has('image_ref')) {
            values.image_ref = target.get('image_ref').toString();
          }

          if (targetSchema.hasMixin('triniti:dam:mixin:image-asset')) {
            values.image_ref = values.target_ref;
          }

          if (target.has('description')) {
            values.description = target.get('description');
          }

          if (!values.description && target.has('meta_description')) {
            values.description = target.get('meta_description');
          }

          if (!values.description && target.has('blocks')) {
            const firstTextBlock = target.get('blocks').find((block) => {
              return block.schema().hasMixin('triniti:canvas:mixin:text-block') && block.has('text');
            });

            if (firstTextBlock) {
              values.description = firstTextBlock.get('text')
                .replace(/(<span.+?>|<a.+?>|<\/?(a|p|ul|ol|span|strong|em|del|u)>)/g, '')
                .replace(/(<br>|<\/li><li>)/g, ' ');
            }
          }
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
          <ModalBody>
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
            type="submit"
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
