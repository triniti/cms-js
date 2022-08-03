import React from 'react';
import GenericBlockPlaceholder from 'components/blocksmith-field/components/generic-block-placeholder';

const config = {
  icon: {
    imgSrc: 'camera',
  },
  label: 'Image Block',
};

export default function ImageBlockPlaceholder(props) {
  return <GenericBlockPlaceholder config={config} {...props} />;
};
