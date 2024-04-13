import React from 'react';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';
import Icon from '@triniti/cms/components/icon';
import { inlineStyleTypes } from '@triniti/cms/components/blocksmith-field/constants';

export default createInlineStyleButton({
  style: inlineStyleTypes.HIGHLIGHT,
  children: (<Icon imgSrc="highlight" alt="highlight" />),
});
