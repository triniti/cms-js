import React from 'react';
import { createBlockStyleButton } from 'draft-js-buttons';
import { Icon } from '@triniti/admin-ui-plugin/components';
import { blockTypes } from '../../constants';

export default createBlockStyleButton({
  blockType: blockTypes.ORDERED_LIST_ITEM,
  children: (<Icon imgSrc="ordered-list" alt="ordered-list" />),
});
