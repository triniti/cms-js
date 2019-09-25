import React from 'react';
import GenericSidebarButton from '@triniti/cms/plugins/blocksmith/components/generic-sidebar-button';

const config = {
  icon: {
    imgSrc: 'sound-wave',
  },
};

export default (props) => <GenericSidebarButton config={config} {...props} />;
