import React from 'react';
import GenericBlockPlaceholder
  from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

const config = {
  label: 'Page Break Block',
  icon: {
    imgSrc: 'page-break',
  },
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
