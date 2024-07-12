import React, { useMemo, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Alert } from 'reactstrap';
import { useFormContext, withPbj } from '@triniti/cms/components/index.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';

function BlockPreview(props) {
  const { Component, onEdit, pbj, ...rest } = props;
  const schema = pbj.schema();

  return (
    <Alert color="info">
      <legend>{schema.getCurie().getMessage()}</legend>
      <Component {...rest} pbj={pbj} />
      <button onClick={onEdit}>edit</button>
    </Alert>
  );
}

export default function withBlockPreview(Component) {
  return function ComponentWithBlockPreview(props) {
    const { curie, pbj } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ModalComponent = useMemo(() => withPbj(resolveComponent(curie, 'modal'), curie, pbj), [curie, pbj]);
    const BlockPreviewWithPbj = useMemo(() => withPbj(BlockPreview, curie, pbj), [curie, pbj]);
    const [editor] = useLexicalComposerContext();
    const formContext = useFormContext();
    const { editMode } = formContext;

    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const handleEdit = (event) => {
      event.preventDefault();
      toggleModal();
    };

    return (
      <>
        <BlockPreviewWithPbj
          {...props}
          Component={Component}
          editor={editor}
          editMode={editMode}
          containerFormContext={formContext}
          onEdit={handleEdit}
        />
        <BlocksmithModal toggle={toggleModal} isOpen={isModalOpen} modal={ModalComponent} />
      </>
    );
  };
}
