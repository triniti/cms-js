import React from 'react';
import { Badge } from 'reactstrap';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function HeadingBlockPreview(props) {
  const { block } = props;
  const Tag = `h${block.get('size', 1)}`;

  if (!block.has('url')) {
    return <Tag><Badge color="dark" className="me-2 text-uppercase">{Tag}</Badge>{block.get('text')}</Tag>;
  }

  return (
    <Tag>
      <Badge color="dark" className="me-2 text-uppercase">{Tag}</Badge>
      <a href={block.get('url')} target="_blank" rel="noreferrer noopener">{block.get('text')}</a>
    </Tag>
  );
}

export default withBlockPreview(HeadingBlockPreview);
