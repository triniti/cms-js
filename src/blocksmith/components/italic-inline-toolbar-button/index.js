import React from 'react';
import { createInlineStyleButton } from '@draft-js-plugins/buttons';
import Icon from '@triniti/cms/components/icon/index.js';

export default createInlineStyleButton({
  style: 'ITALIC',
  children: (<Icon imgSrc="italic" alt="italic" />),
});
