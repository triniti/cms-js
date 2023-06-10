import React from 'react';
import { Media } from 'reactstrap';
import damUrl from 'plugins/dam/damUrl';
import useNode from 'plugins/ncr/components/useNode';

export default function GenericBlockPreviewComponent(props) {
  const { node: block, onToggleImagePreviewSrc: handleToggleImagePreviewSrc } = props;
  const { node } = useNode(block.get('node_ref')?.toString(), false);
  if (node && !node.has('image_ref') && !block.has('image_ref') && !block.has('poster_image_ref') && node.schema().getId().message !== 'image-asset') {
    return null;
  }

  let image = null;
  if (block.has('poster_image_ref')) {
    image = useNode(block.get('poster_image_ref').toString()).node;
  } else if (block.has('image_ref')) {
    image = useNode(block.get('image_ref').toString()).node;
  } else if (node && node.has('image_ref')) {
    image = useNode(node.get('image_ref').toString()).node;
  } else if (node.schema().getId().message === 'image-asset') {
    image = node;
  } else {
    return null;
  }

  return (
    <Media
      className="ms-2 block-placeholder-thumbnail aspect-ratio aspect-ratio-1by1"
      onClick={() => handleToggleImagePreviewSrc(damUrl(image, '1by1', 's'))}
    >
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${image ? damUrl(image, '1by1', 'xxs') : ''})`,
          backgroundPosition: 'center center',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat'
        }}
      />
    </Media>
  );
}
