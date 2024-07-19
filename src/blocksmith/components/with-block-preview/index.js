import React, { useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import startCase from 'lodash-es/startCase.js';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Button, Card, CardBody, CardHeader } from 'reactstrap';
import { useFormContext, withPbj, Loading, Icon } from '@triniti/cms/components/index.js';
import usePolicy from '@triniti/cms/plugins/iam/components/usePolicy.js';
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import { REMOVE_BLOCK_COMMAND, REPLACE_BLOCK_COMMAND } from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import { SHOW_BLOCK_SELECTOR_COMMAND } from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';
import config from '@triniti/cms/blocksmith/config.js';

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

  let nodeStatus = 'unknown';
  if (pbj.has('node_ref')) {
    nodeStatus = node ? node.get('status').getValue() : 'unknown';
  }

  const type = schema.getCurie().getMessage();
  const icon = config.blocks[type]?.icon || type;
  const title = config.blocks[type]?.title || startCase(type.replace('-block', ''));

  return (
    <div className={`blocksmith-block blocksmith-${type} blocksmith-block-node-status-${nodeStatus}`}>
      <Card className="mb-0 block-preview-card">
        <CardHeader className="block-preview-header">
          <span className="d-inline-flex">
            <Icon imgSrc={icon} size="lg" alt="" />
            <div className="divider-vertical"></div>
            {title}
          </span>

          <span>
            <Button color="hover" className="rounded-circle me-0" onClick={onOpen}>
              {editMode && canUpdate ? <Icon imgSrc="pencil" alt="Edit" /> : <Icon imgSrc="eye" alt="View" />}
            </Button>

            {editMode && canDelete && (
              <Button color="hover" className="rounded-circle me-0" onClick={onDelete}>
                <Icon imgSrc="trash" alt="Delete" />
              </Button>
            )}
          </span>
        </CardHeader>

        <CardBody className="p-3 block-preview">
          {pbj.has('node_ref') && (
            <>
              {(!node || pbjxError) && <Loading error={pbjxError} />}
              {node && <Component {...rest} pbj={pbj} block={pbj} node={node} />}
            </>
          )}
          {!pbj.has('node_ref') && <Component {...rest} pbj={pbj} block={pbj} />}
        </CardBody>

        {editMode && (
          <Button color="insert-block" onClick={onInsertBlock}>
            <div className="rounded-circle btn-primary p-1">
              <Icon imgSrc="plus" alt="Insert Block" size="md" />
            </div>
          </Button>
        )}
      </Card>
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
