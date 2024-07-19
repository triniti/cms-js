import React from 'react';
import { Badge } from 'reactstrap';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function HeadingBlockPreview(props) {
  const { block } = props;
  const Tag = `h${block.get('size', 1)}`;

  if (!block.has('url')) {
    return <Tag><Badge color="dark" className="me-2 text-uppercase rounded-circle text-body p-2 mb-1 me-2 bg-opacity-25 fs-5" style={{ lineHeight: '1.2' }}><span>{Tag}</span></Badge>{block.get('text')}</Tag>;
  }

  return (
    <Tag>
      <Badge color="dark" className="me-2 text-uppercase">{Tag}</Badge>
      <a href={block.get('url')} target="_blank" rel="noreferrer noopener">{block.get('text')}</a>
    </Tag>
  );
}

export default withBlockPreview(HeadingBlockPreview);
