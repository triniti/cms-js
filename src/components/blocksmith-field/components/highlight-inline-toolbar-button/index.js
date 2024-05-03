import React from 'react';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';
import Icon from 'components/icon';
import { inlineStyleTypes } from 'components/blocksmith-field/constants';

export default createInlineStyleButton({
  style: inlineStyleTypes.HIGHLIGHT,
  children: (<Icon imgSrc="highlight" alt="highlight" />),
});
