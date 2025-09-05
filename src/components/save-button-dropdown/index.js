import React from 'react';
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { ActionButton, Icon } from '@triniti/cms/components/index.js';

export default function SaveButtonDropDown (props) {
  const { isDisabled, userCanPublish, delegate } = props;
  const handleSaveWithEvent = (value) => delegate.handleSave({ target: { value } });

  return (
    <>
      <UncontrolledDropdown group className="me-2">
        <ActionButton
          text='Save'
          onClick={delegate.handleSave}
          disabled={isDisabled}
          icon='save-diskette'
          color='light'
          outline
        />
        <DropdownToggle disabled={isDisabled} color="light" className="px-2 rounded-end-2" outline>
          <Icon imgSrc='caret-down' alt='More Save Options' size='sm' />
        </DropdownToggle>
        <DropdownMenu end className='px-2 dropdown-menu-arrow-right'>
          {userCanPublish && (
            <ActionButton
              text='Save & Publish'
              onClick={() => handleSaveWithEvent('save-and-publish')}
              icon='save-diskette'
              className='w-100'
              color='light'
              outline 
            />
          )}
          <ActionButton
            text='Save & Close'
            onClick={() => handleSaveWithEvent('save-and-close')}
            icon='save-diskette'
            className='w-100'
            color='light'
            outline
          />
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  );
}