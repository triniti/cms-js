import React from 'react';
import GenericBlockPlaceholder from 'components/blocksmith-field/components/generic-block-placeholder';
import { localize } from 'plugins/utils/services/Localization';

const config = {
  icon: {
    imgSrc: 'camera',
  },
  label: localize('Image Block'),
  preview: {
    component: PreviewComponent,
  },
};

export default function ImageBlockPlaceholder(props) {
  return <GenericBlockPlaceholder config={config} {...props} />;
};
