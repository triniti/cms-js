import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

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
  label: 'Facebook Post Block',
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
