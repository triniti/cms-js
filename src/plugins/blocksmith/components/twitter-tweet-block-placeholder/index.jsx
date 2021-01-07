import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

export default (props) => {
  const { block } = props;

  const config = {
    iconGroup: {
      icons: {
        primary: {
          imgSrc: 'tweet',
        },
        secondary: {
          imgSrc: 'twitter',
        },
      },
    },
    label: `Twitter Tweet Block. Tweet by @${block.getData().get('canvasBlock').get('screen_name')}`,
  };

  return <GenericBlockPlaceholder config={config} {...props} />;
};
