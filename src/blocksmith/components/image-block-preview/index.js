import React from 'react';
import { Media } from 'reactstrap';
import damUrl from '@triniti/cms/plugins/dam/damUrl.js';
import withBlockPreview from '@triniti/cms/blocksmith/components/with-block-preview/index.js';

function ImageBlockPreview(props) {
  const { block, imageAsset } = props;
  const ratio = `${block.get('aspect_ratio', '1by1')}`;
  const version = ratio === 'auto' ? '1by1' : ratio;
  const imageUrl = damUrl(imageAsset.get('_id'), version, 'sm');

  return (
    <>
      <Media
        className={`block-image rounded-3 ratioxx xxratio-${version.replace('by', 'x')}`}
        src={imageUrl}
        alt=""
        width="100"
        height="auto"
        object
      />
      <p className="block-title">{block.get('title', imageAsset.get('title'), '')}</p>
      {block.has('caption') && <p className="block-caption">{block.get('caption')}</p>}
      {block.has('launch_text') && <p className="block-launch_text">{block.get('launch_text')}</p>}
    </>
  );
}

export default withBlockPreview(ImageBlockPreview);
