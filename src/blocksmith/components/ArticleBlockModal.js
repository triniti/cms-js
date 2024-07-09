import React from 'react';
import { FORM_ERROR } from 'final-form';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, FormErrors, withForm, withPbj } from '@triniti/cms/components/index.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import ArticlePickerField from '@triniti/cms/plugins/news/components/article-picker-field/index.js';
import { INSERT_BLOCKSMITH_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import getRootFields from '@triniti/cms/utils/getRootFields.js';

function ArticleBlockModal(props) {
  const [editor] = useLexicalComposerContext();
  console.log('ArticleBlockModal', props);
  const { delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);

  delegate.handleDone = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      const oldObj = FormMarshaler.marshal(pbj, { skipValidation: true });
      const paths = getRootFields(Object.keys(formState.dirtyFields));
      paths.forEach(path => delete oldObj[path]);
      const newObj = { ...oldObj, ...values };
      const newPbj = await FormMarshaler.unmarshal(newObj);

      editor.dispatchCommand(
        INSERT_BLOCKSMITH_BLOCK_COMMAND,
        { curie: newPbj.schema().getCurie().toString(), pbj: newPbj.toObject() }
      );

      props.toggle();
    } catch (e) {
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen backdrop="static">
      <ModalHeader toggle={props.toggle}>Article Block</ModalHeader>
      <ModalBody className="modal-scrollable">
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <ArticlePickerField name="node_ref" label="Article" required />
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
          text="Done"
          onClick={delegate.handleDone}
          disabled={submitDisabled}
          icon="save"
          color="primary"
        />
      </ModalFooter>
    </Modal>
  );
}

export default function ModalWithBlock(props) {
  console.log('ModalWithBlock', props);
  const { curie, pbj } = props;
  const Component = withPbj(withForm(ArticleBlockModal), curie, pbj);
  return <Component {...props} />;
}
