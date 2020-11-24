import { ContentBlock, EditorBlock } from 'draft-js';
import PlaceholderErrorBoundary from '@triniti/cms/plugins/blocksmith/components/placeholder-error-boundary';
import PropTypes from 'prop-types';
import React from 'react';

const DefaultBlockPlaceholder = ({ block, ...rest }) => (
  <PlaceholderErrorBoundary block={block}>
    <EditorBlock block={block} {...rest} />
  </PlaceholderErrorBoundary>
);

DefaultBlockPlaceholder.propTypes = {
  block: PropTypes.instanceOf(ContentBlock).isRequired,
};

export default DefaultBlockPlaceholder;
