import React from 'react';
import { ActionButton } from '@triniti/cms/components/index.js'; 
import useNode from '@triniti/cms/plugins/ncr/components/useNode.js';

export default function SaveNodeButton (props) {
  const { disabled, onClick: handleClick } = props;

  return (
    <ActionButton 
      text='Save'
      onClick={handleClick}
      disabled={disabled}
      icon='save-diskette'
      color='light'
      outline
    />
  );
}