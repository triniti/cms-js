import React, { useCallback, useRef, useState } from 'react';
import noop from 'lodash-es/noop.js';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import BlocksmithModal from '@triniti/cms/blocksmith/components/BlocksmithModal.js';
import BlocksmithNode from '@triniti/cms/blocksmith/nodes/BlocksmithNode.js';
import BlocksmithPlugin from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import ToolbarPlugin from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';

const theme = {
  code: 'code',
  heading: {
    h1: 'heading-h1',
    h2: 'heading-h2',
    h3: 'heading-h3',
    h4: 'heading-h4',
    h5: 'heading-h5',
  },
  image: 'image',
  link: 'link',
  list: {
    listitem: 'listitem',
    nested: {
      listitem: 'nested-listitem',
    },
    ol: 'list-ol',
    ul: 'list-ul',
  },
  ltr: 'ltr',
  paragraph: 'paragraph',
  placeholder: 'placeholder',
  quote: 'quote',
  rtl: 'rtl',
  text: {
    bold: 'text-bold',
    code: 'text-code',
    hashtag: 'text-hashtag',
    italic: 'text-italic',
    overflowed: 'text-overflowed',
    strikethrough: 'text-strikethrough',
    underline: 'text-underline',
    underlineStrikethrough: 'text-underlineStrikethrough',
  },
};

const config = {
  namespace: 'blocksmith',
  nodes: [
    BlocksmithNode,
  ],
  onError(error) {
    console.error(error);
  },
  theme,
};

export default function Blocksmith(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalComponent, setModalComponent] = useState();
  const { pbj, blocks, editMode, node, onChange } = props;
  const delegateRef = useRef({
    TextBlockV1: pbj.schema().getClassProto(),
    handleChange: noop,
  });

  const showModal = (Modal) => {
    setModalComponent(Modal);
    setIsModalOpen(true);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const initialConfig = { ...config, editable: editMode };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="blocksmith">
        <BlocksmithPlugin delegateRef={delegateRef} />
        <OnChangePlugin onChange={delegateRef.current.handleChange} ignoreSelectionChange={true} />
        <ToolbarPlugin showModal={showModal} />
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
