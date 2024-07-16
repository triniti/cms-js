import React from 'react';
import { Media } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function ArticleBlockPreview(props) {
  const { block, article } = props;
  const imageUrl = damUrl(block.get('image_ref', article.get('image_ref')), '1by1', 'sm');

  return (
    <>
      {block.get('show_image') && imageUrl && (
        <Media
          className="block-image rounded-3"
          src={imageUrl}
          alt=""
          width="100"
          height="auto"
          object
        />
      )}
      <p className="block-title">{block.get('title', article.get('title'), '')}</p>
    </>
  );
}

export default withBlockPreview(ArticleBlockPreview);
