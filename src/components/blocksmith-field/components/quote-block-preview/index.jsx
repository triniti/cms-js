import React from 'react';
import classNames from 'classnames';
import 'components/blocksmith-field/components/quote-block-preview/styles.scss';

const QuoteBlockPreview = ({ className, block }) => (
  <div className={classNames('quote-preview', 'px-4', className)} role="presentation">
    <div className={classNames({
      'pull-quote': !!block.get('is_pull_quote'),
    })}
    />
    <div className="quote mb-3">
      {block.get('text')}
    </div>
    {block.get('source') && (
    <div className="source mb-3">
      <strong>SOURCE: </strong>{block.get('source')}
    </div>
    )}
    {block.get('source_url') && (
    <div>
      <strong>SOURCE URL: </strong>
      <a
        className="source-url"
        href={block.get('source_url')}
        rel="noopener noreferrer"
        target="_blank"
      >
        {block.get('source_url')}
      </a>
    </div>
    )}
  </div>
);

export default QuoteBlockPreview;
