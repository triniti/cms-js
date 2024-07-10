import React from 'react';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';
import Icon from '@triniti/cms/components/icon/index.js';

// todo: import STRIKETHROUGH from draft?
export default createInlineStyleButton({
  style: 'STRIKETHROUGH',
  children: (<Icon imgSrc="strikethrough" alt="strikethrough" />),
});
