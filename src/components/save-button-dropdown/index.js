import React from 'react';
import NodeStatus from '@gdbots/schemas/gdbots/ncr/enums/NodeStatus.js';
import { DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { ActionButton, Icon } from '@triniti/cms/components/index.js';

export default function SaveButtonDropDown (props) {
  const { delegate, formState, node, isRefreshing, qname, policy } = props;

  const { dirty, hasSubmitErrors, submitting, valid } = formState;
  const submitDisabled = submitting || isRefreshing || !dirty || (!valid && !hasSubmitErrors);
  const canPublish = policy.isGranted(`${qname}:publish`);
  const isPublished = node.get('status') === NodeStatus.PUBLISHED;
  const isPublishable = node.schema().hasMixin('gdbots:ncr:mixin:publishable');
  const savePublishDisabled = !canPublish || isPublished || !isPublishable;

  return (
    <>
      <UncontrolledDropdown group className="me-2">
        <ActionButton
          text='Save'
          onClick={delegate.handleSave}
          disabled={submitDisabled}
          icon='save-diskette'
          color='light'
          outline
        />
        <DropdownToggle disabled={submitDisabled} color="light" className="px-2 rounded-end-2" outline>
          <Icon imgSrc='caret-down' alt='More Save Options' size='sm' />
        </DropdownToggle>
        <DropdownMenu end className='px-2 dropdown-menu-arrow-right'>
          <ActionButton
            text='Save & Publish'
            value='save-and-publish'
            onClick={delegate.handleSave}
            disabled={savePublishDisabled}
            icon='save-diskette'
            className='w-100'
            color='light'
            outline 
          />
          <ActionButton
            text='Save & Close'
            value='save-and-close'
            onClick={delegate.handleSave}
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