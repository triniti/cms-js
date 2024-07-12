import React from 'react';
import { Card } from 'reactstrap';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import BlocksmithPlugin from '@triniti/cms/blocksmith/plugins/BlocksmithPlugin.js';
import ToolbarPlugin from '@triniti/cms/blocksmith/plugins/ToolbarPlugin.js';
import config from '@triniti/app/config/blocksmith.js';

export default function Blocksmith(props) {
  return (
    <LexicalComposer initialConfig={config}>
      <Card className="blocksmith">
        <BlocksmithPlugin {...props} />
        <ToolbarPlugin />
        <div className="blocksmith-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="blocksmith-input" />}
            placeholder={<div className="blocksmith-placeholder">Start writing...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </Card>
    </LexicalComposer>
  );
}
