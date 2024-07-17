import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import camelCase from 'lodash-es/camelCase.js';
import startCase from 'lodash-es/startCase.js';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Alert, Badge, Button } from 'reactstrap';
import { useFormContext, withPbj, ActionButton, Loading, Icon } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import { REMOVE_BLOCK_COMMAND, REPLACE_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import { SHOW_BLOCK_SELECTOR_COMMAND } from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';

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
    onInsertBlock,
    pbj,
    editMode,
    canUpdate = false,
    canDelete = false,
    ...rest
  } = props;
  const schema = pbj.schema();
  const { node, pbjxError } = useNode(pbj.get('node_ref'));

  let nodeType = 'unknown';
  let nodeStatus = 'unknown';
  if (pbj.has('node_ref')) {
    nodeType = node ? camelCase(node.schema().getCurie().getMessage()) : 'unknown';
    rest[nodeType] = node;
    nodeStatus = node ? node.get('status').getValue() : 'unknown';
  }

  const type = schema.getCurie().getMessage();

  return (
    <div className={`blocksmith-block blocksmith-${type} blocksmith-block-node-status-${nodeStatus}`}>
      <Alert color="dark" className="mb-0">
        <Badge color="light">
          <i className={`icon icon-sm me-2 icon-${type}`} />
          {startCase(type.replace('-block', ''))}
        </Badge>
        {node && (
          <>
            <Badge color="dark" className={`status-${nodeStatus}`}>{nodeStatus}</Badge>
            <a href={nodeUrl(node, 'view')} target="_blank">
              <Button color="hover" tag="span">
                <Icon imgSrc="eye" alt="view" />
              </Button>
            </a>
          </>
        )}

        <div className="block-preview">
          {pbj.has('node_ref') && (
            <>
              {(!node || pbjxError) && <Loading error={pbjxError} />}
              {node && <Component {...rest} pbj={pbj} block={pbj} />}
            </>
          )}
          {!pbj.has('node_ref') && <Component {...rest} pbj={pbj} block={pbj} />}
        </div>

        <ActionButton
          onClick={onOpen}
          text={editMode && canUpdate ? 'Edit' : 'View'}
          icon={editMode && canUpdate ? 'pencil' : 'eye'}
          color="light"
          outline
        />

        {editMode && canDelete && (
          <ActionButton
            onClick={onDelete}
            text="Delete"
            icon="trash"
            color="danger"
            outline
          />
        )}

        {editMode && (
          <ActionButton
            onClick={onInsertBlock}
            text="Insert Block"
            icon="plus-outline"
            color="primary"
            outline
          />
        )}
      </Alert>
    </div>
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
      event.stopPropagation();
      toggleModal();
    };

    const handleDelete = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!editMode || !canDelete) {
        return;
      }

      if (!await okayToDelete()) {
        return;
      }

      editor.dispatchCommand(REMOVE_BLOCK_COMMAND, nodeKey);
    };

    const handleUpdate = (newPbj) => {
      if (!editMode || !canUpdate) {
        return;
      }

      editor.dispatchCommand(REPLACE_BLOCK_COMMAND, { nodeKey, newPbj });
    };

    const handleInsertBlock = (event) => {
      event.preventDefault();
      event.stopPropagation();
      editor.dispatchCommand(SHOW_BLOCK_SELECTOR_COMMAND, nodeKey);
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
          onInsertBlock={handleInsertBlock}
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
