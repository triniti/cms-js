import React, { useMemo } from 'react';
import { FORM_ERROR } from 'final-form';
import startCase from 'lodash-es/startCase.js';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Form, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { ActionButton, FormErrors, Icon, useFormContext, withForm, withPbj } from '@triniti/cms/components/index.js';
import Message from '@gdbots/pbj/Message.js';
import FormMarshaler from '@triniti/cms/utils/FormMarshaler.js';
import getRootFields from '@triniti/cms/utils/getRootFields.js';
import getFriendlyErrorMessage from '@triniti/cms/plugins/pbjx/utils/getFriendlyErrorMessage.js';
import { INSERT_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import config from '@triniti/cms/blocksmith/config.js';

function BlockModal(props) {
  const {
    isNew,
    canUpdate = true,
    canCreate = true,
    editMode,
    ModalFields,
    delegate,
    form,
    formState,
    handleSubmit,
    pbj
  } = props;

  const { dirty, hasSubmitErrors, submitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || !valid || (!isNew && !dirty);
  const schema = pbj.schema();

  delegate.handleUpdate = form.submit;
  delegate.handleSubmit = async (values) => {
    try {
      const oldObj = FormMarshaler.marshal(pbj, { skipValidation: true });
      const paths = getRootFields(Object.keys(formState.dirtyFields));
      paths.forEach(path => delete oldObj[path]);
      const newObj = { ...oldObj, ...values };
      const newPbj = await FormMarshaler.unmarshal(newObj);
      props.onUpdate(newPbj);
      props.toggle();
    } catch (e) {
      return { [FORM_ERROR]: getFriendlyErrorMessage(e) };
    }
  };

  const type = schema.getCurie().getMessage();
  const icon = config.blocks[type]?.icon || type;
  const title = config.blocks[type]?.title || startCase(type);

  return (
    <Modal isOpen backdrop="static" size="lg" centered>
      <ModalHeader toggle={props.toggle}>
        <Icon imgSrc={icon} size="lg" className="me-2" />
        {title}
      </ModalHeader>
      <ModalBody>
        {hasSubmitErrors && <FormErrors errors={submitErrors} />}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <ModalFields {...props} />
        </Form>
      </ModalBody>
      <ModalFooter>
        <ActionButton
          text={isNew ? 'Cancel' : 'Close'}
          onClick={props.toggle}
          icon="close-sm"
          color="light"
          tabIndex="-1"
        />
        {editMode && ((!isNew && canUpdate) || (isNew && canCreate)) && (
          <ActionButton
            type="submit"
            text={isNew ? `Add ${title}` : `Update ${title}`}
            onClick={delegate.handleUpdate}
            disabled={submitDisabled}
            icon={isNew ? 'plus-outline' : 'save'}
            color="primary"
          />
        )}
      </ModalFooter>
    </Modal>
  );
}

export default function withBlockModal(Component) {
  return function ComponentWithBlockModal(props) {
    const {
      curie,
      pbj,
      canUpdate = false,
      canCreate = false,
      afterNodeKey = null
    } = props;
    const BlockModalWithPbj = useMemo(() => {
      return pbj instanceof Message ? withForm(BlockModal) : withPbj(withForm(BlockModal), curie, pbj);
    }, [curie, pbj]);

    const [editor] = useLexicalComposerContext();
    const formContext = useFormContext();
    const { editMode } = formContext;

    const isNew = !props.onUpdate;
    const onUpdate = !isNew ? props.onUpdate : (newPbj) => {
      editor.dispatchCommand(INSERT_BLOCK_COMMAND, { newPbj, afterNodeKey });
    };

    return (
      <BlockModalWithPbj
        {...props}
        ModalFields={Component}
        editor={editor}
        editMode={editMode && (canUpdate || canCreate)}
        containerFormContext={formContext}
        onUpdate={onUpdate}
        isNew={isNew}
      />
    );
  };
}
