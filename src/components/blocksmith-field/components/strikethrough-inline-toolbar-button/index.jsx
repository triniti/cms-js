import React from 'react';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';
import Icon from 'components/icon';

// todo: import STRIKETHROUGH from draft?
export default createInlineStyleButton({
  style: 'STRIKETHROUGH',
  children: (<Icon imgSrc="strikethrough" alt="strikethrough" />),
});
