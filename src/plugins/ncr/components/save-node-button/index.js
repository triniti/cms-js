import React from 'react';
import { ActionButton } from '@triniti/cms/components/index.js';

export default function SaveNodeButton (props) {
  const { disabled, onClick: handleSave } = props;

  return (
    <ActionButton 
      text='Save'
      onClick={handleSave}
      disabled={disabled}
      icon='save-diskette'
      color='light'
      outline
    />
  );
}