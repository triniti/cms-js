import React, { useMemo, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import { Alert } from 'reactstrap';
import { useFormContext, withPbj } from '@triniti/cms/components/index.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import { $createBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';

function BlockPreview(props) {
  const { Component, onEdit, onRemove, pbj, editMode, ...rest } = props;
  const schema = pbj.schema();

  return (
    <Alert color="info">
      <legend>{schema.getCurie().getMessage()}</legend>
      <Component {...rest} pbj={pbj} />
      {editMode && (
        <>
          <button onClick={onEdit}>edit</button>
          -
          <button onClick={onRemove}>remove</button>
        </>
      )}
    </Alert>
  );
}

export default function withBlockPreview(Component) {
  return function ComponentWithBlockPreview(props) {
    console.log('ComponentWithBlockPreview', props);
    const { curie, pbj, nodeKey } = props;
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

    const handleRemove = () => {
      if (!editMode) {
        return;
      }

      editor.update(() => {
        const $node = $getNodeByKey(nodeKey);
        if ($node) {
          $node.remove();
        }
      });
    };

    const handleEditDone = (newPbj) => {
      if (!editMode) {
        return;
      }

      editor.update(() => {
        const $node = $getNodeByKey(nodeKey);
        if ($node) {
          const curie = newPbj.schema().getCurie().toString();
          $node.replace($createBlocksmithNode(curie, newPbj.toObject()));
        }
      });
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
          onRemove={handleRemove}
        />
        <BlocksmithModal
          toggle={toggleModal}
          isOpen={isModalOpen}
          modal={ModalComponent}
          onDone={handleEditDone}
        />
      </>
    );
  };
}
