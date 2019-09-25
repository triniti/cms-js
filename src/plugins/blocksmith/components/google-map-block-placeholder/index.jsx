import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

const config = {
  icon: {
    imgSrc: 'google-maps',
  },
  label: 'Google Map Block',
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
