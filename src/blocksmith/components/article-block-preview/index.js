import React from 'react';
import { Badge, Button, Media } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import nodeUrl from '@triniti/cms/plugins/ncr/nodeUrl.js';
import { Icon } from '@triniti/cms/components/index.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function ArticleBlockPreview(props) {
  const { block, article } = props;
  const imageUrl = damUrl(block.get('image_ref', article.get('image_ref')), '1by1', 'sm');
  const status = article.get('status').getValue();

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

      <p>
        <a href={nodeUrl(article, 'view')} target="_blank">
          <Button color="hover" tag="span" size="sm" className="mb-0 me-0 p-0" style={{ minHeight: 'initial' }}>
            <Icon imgSrc="external" alt="view" />
          </Button>
        </a>
        <Badge color="dark" className={`align-self-end status-${status}`}>{status}</Badge>
      </p>
    </>
  );
}

export default withBlockPreview(ArticleBlockPreview);
