import React from 'react';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';
import Icon from '@triniti/cms/components/icon/index.js';
import { inlineStyleTypes } from '@triniti/cms/components/blocksmith-field/constants.js';

export default createInlineStyleButton({
  style: inlineStyleTypes.HIGHLIGHT,
  children: (<Icon imgSrc="highlight" alt="highlight" />),
});
