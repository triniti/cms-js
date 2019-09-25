import PropTypes from 'prop-types';
import React from 'react';

import { Button, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';

import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({ disabled, node: timeline, onSelectRow, isSelected }) => (
  <tr className={`status-${timeline.get('status')}`}>
    <th scope="row">
      <Checkbox
        disabled={disabled}
        id={NodeRef.fromNode(timeline)}
        onChange={() => onSelectRow(NodeRef.fromNode(timeline))}
        checked={isSelected}
        size="sm"
      />
    </th>
    <td>
      {timeline.get('title')}
      <Collaborators nodeRef={NodeRef.fromNode(timeline)} />
    </td>
    <td className="text-nowrap">{convertReadableTime(timeline.get('order_date'))}</td>
    <td className="text-nowrap">
      {timeline.has('published_at') && convertReadableTime(timeline.get('published_at'))}
    </td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(timeline, 'cms')}>
        <Button id={`view-${timeline.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${timeline.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(timeline, 'cms')}/edit`}>
        <Button id={`edit-${timeline.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${timeline.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
      <a
        href={pbjUrl(timeline, 'canonical')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button color="hover" id={`open-in-new-tab-${timeline.get('_id')}`} radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="external" style={{ color: isSelected ? 'white' : '' }} alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${timeline.get('_id')}`}>Open in new tab</UncontrolledTooltip>
      </a>
    </td>
  </tr>
);

TableRow.propTypes = {
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  node: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
