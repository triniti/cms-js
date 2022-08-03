import React from 'react';
import { createBlockStyleButton } from '@draft-js-plugins/buttons';
import Icon from 'components/icon';
import { blockTypes } from 'components/blocksmith-field/constants';

export default createBlockStyleButton({
  blockType: blockTypes.ORDERED_LIST_ITEM,
  children: (<Icon imgSrc="ordered-list" alt="ordered-list" />),
});
