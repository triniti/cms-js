import React from 'react';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function ArticleBlockPreview(props) {
  const { pbj, article } = props;

  return (
    <>
      <p>{pbj.get('title', article.get('title'))}</p>
      <p>{pbj.schema().getId().getCurie().toString()}</p>
    </>
  );
}

export default withBlockPreview(ArticleBlockPreview);
