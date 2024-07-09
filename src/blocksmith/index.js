import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import ToolbarPlugin from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';

const theme = {
  code: 'blocksmith-code',
  heading: {
    h1: 'blocksmith-heading-h1',
    h2: 'blocksmith-heading-h2',
    h3: 'blocksmith-heading-h3',
    h4: 'blocksmith-heading-h4',
    h5: 'blocksmith-heading-h5',
  },
  image: 'blocksmith-image',
  link: 'blocksmith-link',
  list: {
    listitem: 'blocksmith-listitem',
    nested: {
      listitem: 'blocksmith-nested-listitem',
    },
    ol: 'blocksmith-list-ol',
    ul: 'blocksmith-list-ul',
  },
  ltr: 'ltr',
  paragraph: 'blocksmith-paragraph',
  placeholder: 'blocksmith-placeholder',
  quote: 'blocksmith-quote',
  rtl: 'rtl',
  text: {
    bold: 'blocksmith-text-bold',
    code: 'blocksmith-text-code',
    hashtag: 'blocksmith-text-hashtag',
    italic: 'blocksmith-text-italic',
    overflowed: 'blocksmith-text-overflowed',
    strikethrough: 'blocksmith-text-strikethrough',
    underline: 'blocksmith-text-underline',
    underlineStrikethrough: 'blocksmith-text-underlineStrikethrough',
  },
};

const config = {
  namespace: 'blocksmith',
  nodes: [],
  onError(error) {
    console.error(error);
  },
  theme,
};

export default function Blocksmith(props) {
  const { blocks, editMode, node, onChange } = props;

  const handleChange = (editorState) => {
    const state = editorState.toJSON();
    const nodes = state?.root?.children || [];
    console.log('handleChange', state);
    nodes.map(n => console.log(n.type, n));
  };

  const initialConfig = {...config, editable: editMode };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="blocksmith">
        <ToolbarPlugin />
        <OnChangePlugin onChange={handleChange} ignoreSelectionChange={true} />
        <div className="blocksmith-inner">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="blocksmith-input"
                aria-placeholder="Start writing..."
                placeholder={
                  <div className="blocksmith-placeholder">Start writing...</div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}
