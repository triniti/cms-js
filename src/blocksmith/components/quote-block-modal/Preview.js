import React from 'react';
import classNames from 'classnames';
import '@triniti/cms/blocksmith/components/quote-block-modal/Preview.scss';

export default function Preview(props) {
  const { formState, className = '' } = props;
  const { is_pull_quote: isPullQuote, source, source_url: sourceUrl, text, } = formState.values;

  return (
    <div className={classNames('quote-preview', 'px-4', className)} role="presentation">
      <div className={classNames({
        'pull-quote': !!isPullQuote,
      })}
      />
      <div className="quote mb-3">
        {text}
      </div>
      {source && (
      <div className="source mb-3">
        <strong>SOURCE: </strong>{source}
      </div>
      )}
      {sourceUrl && (
      <div>
        <strong>SOURCE URL: </strong>
        <a
          className="source-url"
          href={sourceUrl}
          rel="noopener noreferrer"
          target="_blank"
        >
          {sourceUrl}
        </a>
      </div>
      )}
    </div>
  );
}
