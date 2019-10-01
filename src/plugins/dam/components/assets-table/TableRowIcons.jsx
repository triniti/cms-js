import PropTypes from 'prop-types';
import React from 'react';
import Message from '@gdbots/pbj/Message';
import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

import damUrl from '../../utils/damUrl';

const TableRowIcons = ({ asset }) => ([
  <RouterLink key="a" to={pbjUrl(asset, 'cms')}>
    <Button id={`view-${asset.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
      <Icon imgSrc="eye" alt="view" />
    </Button>
    <UncontrolledTooltip placement="auto" target={`view-${asset.get('_id')}`}>View</UncontrolledTooltip>
  </RouterLink>,
  <RouterLink key="b" to={`${pbjUrl(asset, 'cms')}/edit`}>
    <Button id={`edit-${asset.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
      <Icon imgSrc="pencil" alt="edit" />
    </Button>
    <UncontrolledTooltip placement="auto" target={`edit-${asset.get('_id')}`}>Edit</UncontrolledTooltip>
  </RouterLink>,
  <a key="c" href={damUrl(asset)} target="_blank" rel="noopener noreferrer">
    <Button id={`open-${asset.get('_id')}`} color="hover" radius="circle" className="mr-1 mb-0">
      <Icon imgSrc="external" alt="open" />
    </Button>
    <UncontrolledTooltip placement="auto" target={`open-${asset.get('_id')}`}>Open in New Tab</UncontrolledTooltip>
  </a>,
]);

TableRowIcons.propTypes = {
  asset: PropTypes.instanceOf(Message).isRequired,
};

export default TableRowIcons;
