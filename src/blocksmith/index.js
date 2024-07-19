import React, { useRef } from 'react';
import { Badge, Card, CardHeader } from 'reactstrap';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import BlocksmithPlugin from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import DraggableBlockPlugin from '@triniti/cms/blocksmith/plugins/DraggableBlockPlugin.js';
import ToolbarPlugin from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';
import { useFormContext } from '@triniti/cms/components/index.js';
import config from '@triniti/cms/blocksmith/config.js';

export default function Blocksmith(props) {
  const { editMode, pbj } = useFormContext();
  const editorRef = useRef(null);
  config.editable = editMode;

  return (
    <LexicalComposer initialConfig={config}>
      <Card className="blocksmith">
        {!editMode && (
          <CardHeader>
            Content
            {pbj.get('word_count') > 0 && (
              <span className="text-light">
                Word Count: <Badge color="dark">{pbj.get('word_count')}</Badge>
              </span>
            )}
          </CardHeader>
        )}
        <BlocksmithPlugin {...props} />
        <LinkPlugin />
        <ListPlugin />
        {editMode && (
          <>
            {editorRef.current && <DraggableBlockPlugin anchorElem={editorRef.current} />}
            <HistoryPlugin />
            <ToolbarPlugin />
          </>
        )}
        <div className="position-relative">
          <RichTextPlugin
            contentEditable={
              <div className="blocksmith-editor" ref={editorRef}>
                <ContentEditable className="blocksmith-input" />
              </div>
            }
            placeholder={
              <div className="blocksmith-placeholder">
                <em>{editMode ? 'Start writing here...' : 'Nothing to see yet.'}</em>
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </Card>
    </LexicalComposer>
  );
}
