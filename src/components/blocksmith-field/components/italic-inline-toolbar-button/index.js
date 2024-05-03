import React from 'react';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';
import Icon from 'components/icon';

export default createInlineStyleButton({
  style: 'ITALIC',
  children: (<Icon imgSrc="italic" alt="italic" />),
});
