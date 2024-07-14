import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Alert } from 'reactstrap';
import { useFormContext, withPbj } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import {
  REMOVE_BLOCKSMITH_BLOCK_COMMAND,
  REPLACE_BLOCKSMITH_BLOCK_COMMAND
} from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';

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
  const {
    Component,
    onDelete,
    onOpen,
    pbj,
    editMode,
    canUpdate = false,
    canDelete = false,
    ...rest
  } = props;
  const schema = pbj.schema();

  return (
    <Alert color="info">
      <legend>{schema.getCurie().getMessage()}</legend>
      <Component {...rest} pbj={pbj} />
      <button onClick={onOpen}>{editMode && canUpdate ? 'edit' : 'view'}</button>
      {editMode && canDelete && <button onClick={onDelete}>delete</button>}
    </Alert>
  );
}

export default function withBlockPreview(Component) {
  return function ComponentWithBlockPreview(props) {
    const { curie, pbj, nodeKey } = props;
    const policy = usePolicy();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const ModalComponent = useMemo(() => withPbj(resolveComponent(curie, 'modal'), curie, pbj), [curie, pbj]);
    const BlockPreviewWithPbj = useMemo(() => withPbj(BlockPreview, curie, pbj), [curie, pbj]);
    const [editor] = useLexicalComposerContext();
    const formContext = useFormContext();
    const { editMode } = formContext;

    const type = curie.split(':').pop();
    const canDelete = policy.isGranted(`blocksmith:${type}:delete`);
    const canUpdate = policy.isGranted(`blocksmith:${type}:update`);

    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const handleOpen = (event) => {
      event.preventDefault();
      toggleModal();
    };

    const handleDelete = async (event) => {
      event.preventDefault();

      if (!editMode || !canDelete) {
        return;
      }

      if (!await okayToDelete()) {
        return;
      }

      editor.dispatchCommand(REMOVE_BLOCKSMITH_BLOCK_COMMAND, nodeKey);
    };

    const handleUpdate = (newPbj) => {
      if (!editMode || !canUpdate) {
        return;
      }

      editor.dispatchCommand(REPLACE_BLOCKSMITH_BLOCK_COMMAND, { nodeKey, newPbj });
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
          canDelete={canDelete}
          canUpdate={canUpdate}
        />
        <BlocksmithModal
          toggle={toggleModal}
          isOpen={isModalOpen}
          modal={ModalComponent}
          onUpdate={handleUpdate}
          canDelete={canDelete}
          canUpdate={canUpdate}
        />
      </>
    );
  };
}
