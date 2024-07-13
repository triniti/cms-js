import React, { useMemo } from 'react';
import { FORM_ERROR } from 'final-form';
import startCase from 'lodash-es/startCase.js';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, FormErrors, useFormContext, withForm, withPbj } from '@triniti/cms/components/index.js';
import Message from '@gdbots/pbj/Message.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import getRootFields from '@triniti/cms/utils/getRootFields.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import { INSERT_BLOCKSMITH_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';

function BlockModal(props) {
  const { editMode, ModalFields, delegate, form, formState, handleSubmit, pbj } = props;
  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !dirty || (!valid && !hasSubmitErrors);
  const schema = pbj.schema();

  delegate.handleDone = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      const oldObj = FormMarshaler.marshal(pbj, { skipValidation: true });
      const paths = getRootFields(Object.keys(formState.dirtyFields));
      paths.forEach(path => delete oldObj[path]);
      const newObj = { ...oldObj, ...values };
      const newPbj = await FormMarshaler.unmarshal(newObj);
      props.onDone(newPbj);
      props.toggle();
    } catch (e) {
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  return (
    <Modal isOpen backdrop="static" size="lg" centered>
      <ModalHeader toggle={props.toggle}>{startCase(schema.getCurie().getMessage())}</ModalHeader>
      <ModalBody className="modal-scrollable">
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <ModalFields {...props} />
        </Form>
      </ModalBody>
      <ModalFooter>
        {!editMode && <ActionButton text="Close" onClick={props.toggle} />}
        {editMode && (
          <>
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
          </>
        )}
      </ModalFooter>
    </Modal>
  );
}

export default function withBlockModal(Component) {
  return function ComponentWithBlockModal(props) {
    const { curie, pbj } = props;
    const BlockModalWithPbj = useMemo(() => {
      return pbj instanceof Message ? withForm(BlockModal) : withPbj(withForm(BlockModal), curie, pbj);
    }, [curie, pbj]);

    const [editor] = useLexicalComposerContext();
    const formContext = useFormContext();
    const { editMode } = formContext;

    const onDone = props.onDone ? props.onDone : (newPbj) => {
      editor.dispatchCommand(
        INSERT_BLOCKSMITH_BLOCK_COMMAND,
        { curie: newPbj.schema().getCurie().toString(), pbj: newPbj.toObject() }
      );
    };

    return (
      <BlockModalWithPbj
        {...props}
        ModalFields={Component}
        editor={editor}
        editMode={editMode}
        containerFormContext={formContext}
        onDone={onDone}
      />
    );
  };
}
