import React from 'react';
import GenericBlockPlaceholder from '@triniti/cms/plugins/blocksmith/components/generic-block-placeholder';
import PollGridBlockV1Mixin from '@triniti/schemas/triniti/canvas/mixin/poll-grid-block/PollGridBlockV1Mixin';
import { localize } from '@triniti/cms/plugins/utils/services/Localization';
import siteLogo from 'assets/img/svg/icon/site-logo.svg'; // eslint-disable-line import/no-unresolved

const config = {
  label: `${localize(PollGridBlockV1Mixin.findOne().getQName().getVendor())} Poll Grid Block`,
  iconGroup: {
    icons: {
      primary: {
        imgSrc: 'poll-grid',
      },
      secondary: {
        src: siteLogo,
      },
    },
  },
};

export default (props) => <GenericBlockPlaceholder config={config} {...props} />;
