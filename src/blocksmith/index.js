import React, { useRef, useState } from 'react';
import noop from 'lodash-es/noop.js';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import BlocksmithModal from '@triniti/cms/blocksmith/components/BlocksmithModal.js';
import BlocksmithPlugin from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import ToolbarPlugin from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import config from '@triniti/cms/blocksmith/config.js';

export default function Blocksmith(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  const { pbj, blocks, editMode, node, onChange } = props;
  const delegateRef = useRef({
    TextBlockV1: pbj.schema().getClassProto(),
    handleChange: noop,
  });

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateBlock = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const type = event.target.dataset.type;
    const curie = `${APP_VENDOR}:canvas:block:${type}`;
    const Component = resolveComponent(curie, 'Modal');
    const Modal = () => (p) => <Component curie={curie} {...p} />;
    setModalComponent(Modal);
    setIsModalOpen(true);
  };

  const initialConfig = { ...config, editable: editMode };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="blocksmith">
        <BlocksmithPlugin delegateRef={delegateRef} />
        <OnChangePlugin onChange={delegateRef.current.handleChange} ignoreSelectionChange={true} />
        <ToolbarPlugin onCreateBlock={handleCreateBlock} />
        <div className="blocksmith-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="blocksmith-input" />
            }
            placeholder="Start writing..."
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
      <BlocksmithModal
        toggle={toggleModal}
        isOpen={isModalOpen}
        modal={modalComponent}
      />
    </LexicalComposer>
  );
}
