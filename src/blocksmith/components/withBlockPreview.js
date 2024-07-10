import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Alert } from 'reactstrap';
import { withPbj } from '@triniti/cms/components/index.js';

function BlockPreview(props) {
  const { Component, pbj, ...rest } = props;
  const schema = pbj.schema();

  return (
    <Alert color="info">
      <legend>{schema.getCurie().getMessage()}</legend>
      <Component {...rest} pbj={pbj} />
    </Alert>
  );
}

export default function withBlockPreview(Component) {
  return function ComponentWithBlockPreview(props) {
    const { curie, pbj } = props;
    const BlockPreviewWithPbj = withPbj(BlockPreview, curie, pbj);
    const [editor] = useLexicalComposerContext();
    return <BlockPreviewWithPbj {...props} Component={Component} editor={editor} />;
  };
}
