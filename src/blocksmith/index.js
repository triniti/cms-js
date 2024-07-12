import React, { useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import BlocksmithModal from '@triniti/cms/blocksmith/components/blocksmith-modal/index.js';
import BlocksmithPlugin from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import ToolbarPlugin from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';
import resolveComponent from '@triniti/cms/blocksmith/utils/resolveComponent.js';
import config from '@triniti/cms/blocksmith/config.js';

export default function Blocksmith(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCreateBlock = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const type = event.target.dataset.type;
    const curie = `${APP_VENDOR}:canvas:block:${type}`;
    const Component = resolveComponent(curie, 'modal');
    const Modal = () => (p) => <Component curie={curie} {...p} />;
    setModalComponent(Modal);
    setIsModalOpen(true);
  };

  return (
    <LexicalComposer initialConfig={config}>
      <div className="blocksmith">
        <BlocksmithPlugin {...props} />
        <ToolbarPlugin onCreateBlock={handleCreateBlock} />
        <div className="blocksmith-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="blocksmith-input" />}
            placeholder={<div className="blocksmith-placeholder">Start writing...</div>}
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
