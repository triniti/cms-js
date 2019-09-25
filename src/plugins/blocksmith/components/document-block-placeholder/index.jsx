import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import DocumentBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/document-block/DocumentBlockV1Mixin';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved
import PreviewComponent from './PreviewComponent';

const config = {
  label: `${localize(DocumentBlockV1Mixin.findOne().getQName().getVendor())} Document Block`,
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'document',
      },
      secondary: {
        src: siteLogo,
      },
    },
  },
  preview: {
    component: PreviewComponent,
  },
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
