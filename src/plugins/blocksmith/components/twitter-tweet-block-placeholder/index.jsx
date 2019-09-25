import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

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
  label: 'Twitter Tweet Block',
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
