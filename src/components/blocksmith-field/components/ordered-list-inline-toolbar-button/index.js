import React from 'react';
import { createBlockStyleButton } from '@draft-js-plugins/buttons';
import Icon from '@triniti/cms/components/icon/index.js';
import { blockTypes } from '@triniti/cms/components/blocksmith-field/constants.js';

export default createBlockStyleButton({
  blockType: blockTypes.ORDERED_LIST_ITEM,
  children: (<Icon imgSrc="ordered-list" alt="ordered-list" />),
});