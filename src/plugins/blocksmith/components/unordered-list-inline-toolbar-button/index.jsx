import React from 'react';
import { createBlockStyleButton } from 'draft-js-buttons';
import { Icon } from '@triniti/admin-ui-plugin/components';

export default createBlockStyleButton({
  blockType: 'unordered-list-item',
  children: (<Icon imgSrc="list" alt="unordered-list" />),
});
