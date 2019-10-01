import React from 'react';
import GenericSidebarButton from '@triniti/cms/plugins/blocksmith/components/generic-sidebar-button';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved

const config = {
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'camera',
      },
      secondary: {
        src: siteLogo,
      },
    },
  },
};

export default (props) => <GenericSidebarButton config={config} {...props} />;
