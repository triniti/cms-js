import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function TwitterTweetBlockPreview(props) {
  const { block } = props;
  const url = `https://x.com/${block.get('screen_name')}/status/${block.get('tweet_id')}`;

  return (
    <p>
      <a href={url} target="_blank" rel="noreferrer noopener">{url}</a>
    </p>
  );
}

export default withBlockPreview(TwitterTweetBlockPreview);
