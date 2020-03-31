import React from 'react';
import { createInlineStyleButton } from 'draft-js-buttons';
import { Icon } from '@triniti/admin-ui-plugin/components';
import { inlineStyleTypes } from '../../constants';

export default createInlineStyleButton({
  style: inlineStyleTypes.HIGHLIGHT,
  children: (<Icon imgSrc="highlight" alt="highlight" />),
});
