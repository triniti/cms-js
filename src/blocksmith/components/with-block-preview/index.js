import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey } from 'lexical';
import { Alert } from 'reactstrap';
import { useFormContext, withPbj } from '@triniti/cms/components/index.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import { $createBlocksmithNode } from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import { REMOVE_BLOCKSMITH_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';

const okayToDelete = async () => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  return !!result.value;
};

function BlockPreview(props) {
  const { Component, onDelete, onOpen, pbj, editMode, ...rest } = props;
  const schema = pbj.schema();

  return (
    <Alert color="info">
      <legend>{schema.getCurie().getMessage()}</legend>
      <Component {...rest} pbj={pbj} />
      {!editMode && (
        <button onClick={onOpen}>view</button>
      )}
      {editMode && (
        <>
        <button onClick={onOpen}>edit</button>
          -
          <button onClick={onDelete}>delete</button>
        </>
      )}
    </Alert>
  );
}

export default function withBlockPreview(Component) {
  return function ComponentWithBlockPreview(props) {
    const { curie, pbj, nodeKey } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ModalComponent = useMemo(() => withPbj(resolveComponent(curie, 'modal'), curie, pbj), [curie, pbj]);
    const BlockPreviewWithPbj = useMemo(() => withPbj(BlockPreview, curie, pbj), [curie, pbj]);
    const [editor] = useLexicalComposerContext();
    const formContext = useFormContext();
    const { editMode } = formContext;

    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const handleOpen = (event) => {
      event.preventDefault();
      toggleModal();
    };

    const handleDelete = async (event) => {
      event.preventDefault();

      if (!editMode) {
        return;
      }

      if (!await okayToDelete()) {
        return;
      }

      editor.dispatchCommand(REMOVE_BLOCKSMITH_BLOCK_COMMAND, nodeKey);
    };

    const handleUpdate = (newPbj) => {
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
          onOpen={handleOpen}
          onDelete={handleDelete}
        />
        <BlocksmithModal
          toggle={toggleModal}
          isOpen={isModalOpen}
          modal={ModalComponent}
          onUpdate={handleUpdate}
        />
      </>
    );
  };
}
