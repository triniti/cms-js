import React from 'react';
import GenericSidebarButton from '@triniti/cms/plugins/blocksmith/components/generic-sidebar-button';

const config = {
  icon: {
    imgSrc: 'google-maps',
  },
};

export default (props) => <GenericSidebarButton config={config} {...props} />;
