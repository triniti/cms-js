import GenericSidebarButton
  from '@triniti/cms/plugins/blocksmith/components/generic-sidebar-button';
import React from 'react';

const config = {
  icon: {
    imgSrc: 'iframe',
  },
};

export default (props) => <GenericSidebarButton config={config} {...props} />;
