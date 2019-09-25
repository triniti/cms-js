import React from 'react';
import { createInlineStyleButton } from 'draft-js-buttons';
import { Icon } from '@triniti/admin-ui-plugin/components';

export default createInlineStyleButton({
  style: 'BOLD',
  children: (<Icon imgSrc="bold" alt="bold" />),
});
