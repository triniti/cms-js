import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import DividerBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/divider-block/DividerBlockV1Mixin';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved

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
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
