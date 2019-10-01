import React from 'react';
import GenericSidebarButton from '@triniti/cms/plugins/blocksmith/components/generic-sidebar-button';

const config = {
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'video',
      },
      secondary: {
        imgSrc: 'facebook',
      },
    },
  },
};

export default (props) => <GenericSidebarButton config={config} {...props} />;
