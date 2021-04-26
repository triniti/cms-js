import { EditorState } from 'draft-js';
import React, { useState } from 'react';

import Blocksmith from './Blocksmith';
import ErrorBoundary from './error-boundary';

export default ({ ...rest }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  return (
    <ErrorBoundary
      editorState={editorState}
      formName={rest.formName}
    >
      <Blocksmith onSetEditorState={setEditorState} {...rest} />
    </ErrorBoundary>
  );
};
