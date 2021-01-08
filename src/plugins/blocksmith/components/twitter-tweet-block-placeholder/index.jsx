import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

export default (props) => {
  const { block } = props;
  const node = block.getData().get('canvasBlock').get('screen_name');
  const userName = node ? `Tweeted by @${node}` : '';

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
    label: `Twitter Tweet Block. ${userName}`,
  };

  return <GenericBlockPlaceholder config={config} {...props} />;
};
