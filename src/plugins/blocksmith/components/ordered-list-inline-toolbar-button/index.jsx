import React from 'react';
import { createBlockStyleButton } from 'draft-js-buttons';
import { Icon } from '@triniti/admin-ui-plugin/components';

export default createBlockStyleButton({
  blockType: 'ordered-list-item',
  children: (<Icon imgSrc="ordered-list" alt="ordered-list" />),
});
