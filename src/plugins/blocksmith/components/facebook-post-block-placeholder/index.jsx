import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

export default (props) => {
  const { block } = props;
  const node = block.getData().get('canvasBlock').get('href');
  const userName = `Post by ${node.split('/')[3]}`;

  const config = {
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'pencil',
        },
        secondary: {
          imgSrc: 'facebook',
        },
      },
    },
    label: `Facebook Post Block. ${node || ''}`,
  };

  return <GenericBlockPlaceholder config={config} {...props} />;
};
