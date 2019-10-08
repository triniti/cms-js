import React from 'react';
import DividerBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/divider-block/DividerBlockV1Mixin';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved
import PreviewComponent from './PreviewComponent';

const config = {
  label: `${localize(DividerBlockV1Mixin.findOne().getQName().getVendor())} Divider Block`,
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'minus',
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
