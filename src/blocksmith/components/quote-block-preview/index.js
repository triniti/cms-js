import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function QuoteBlockPreview(props) {
  const { block } = props;
  return (
    <blockquote className="blockquote">
      <span className="quote-text">{block.get('text')}</span>
      {block.has('source') && (
        <span className="quote-source">
          {block.has('source_url') && (
            <a href={block.get('source_url')} target="_blank" rel="noreferrer noopener">
              {block.get('source')}
            </a>
          )}
          {!block.has('source_url') && block.get('source')}
        </span>
      )}
    </blockquote>
  );
}

export default withBlockPreview(QuoteBlockPreview);
