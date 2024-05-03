import React from 'react';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';
import Icon from 'components/icon';

export default createInlineStyleButton({
  style: 'UNDERLINE',
  children: (<Icon imgSrc="underline" alt="underline" />),
});
