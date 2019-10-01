import React from 'react';
import GenericSidebarButton from
  '@triniti/cms/plugins/blocksmith/components/generic-sidebar-button';
// eslint-disable-next-line import/no-unresolved
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved

const config = {
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'page-break',
      },
      secondary: {
        src: siteLogo,
      },
    },
  },
};

export default (props) => <GenericSidebarButton config={config} {...props} />;
