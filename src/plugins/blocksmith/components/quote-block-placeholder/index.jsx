import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';

const config = {
  label: 'Quote Block',
  icon: {
    imgSrc: 'quote',
  },
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
