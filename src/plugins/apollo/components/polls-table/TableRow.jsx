import React from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';

import { Button, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({
  disabled,
  isBulkOperationEnabled,
  isSelected,
  onSelectRow,
  poll,
}) => (
  <tr
    className={isBulkOperationEnabled ? `status-${poll.get('status')}` : ''}
    onClick={!isBulkOperationEnabled ? () => onSelectRow(poll) : noop}
    style={!isBulkOperationEnabled ? {
      cursor: 'pointer',
      backgroundColor: isSelected ? '#04c5a2' : '',
      color: isSelected ? 'white' : '',
    } : {}}
  >
    {isBulkOperationEnabled
      && (
      <th scope="row">
        <Checkbox
          checked={isSelected}
          disabled={disabled}
          id={poll.get('_id').toNodeRef().toString()}
          onChange={() => onSelectRow(poll.get('_id').toNodeRef())}
          size="sm"
        />
      </th>
      )}
    <td>
      {poll.get('title')}
      <Collaborators nodeRef={poll.get('_id').toNodeRef()} />
    </td>
    <td className="text-nowrap">{convertReadableTime(poll.get('created_at'))}</td>
    <td className="text-nowrap">{poll.has('published_at') && convertReadableTime(poll.get('published_at'))}</td>
    {
      isBulkOperationEnabled
      && (
      <td className="td-icons text-right">
        <RouterLink to={pbjUrl(poll, 'cms')}>
          <Button id={`view-${poll.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
            <Icon imgSrc="eye" alt="view" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`view-${poll.get('_id')}`}>View</UncontrolledTooltip>
        </RouterLink>
        <RouterLink to={`${pbjUrl(poll, 'cms')}/edit`}>
          <Button id={`edit-${poll.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
            <Icon imgSrc="pencil" alt="edit" />
          </Button>
          <UncontrolledTooltip placement="auto" target={`edit-${poll.get('_id')}`}>Edit</UncontrolledTooltip>
        </RouterLink>
      </td>
      )
    }
  </tr>
);

TableRow.propTypes = {
  disabled: PropTypes.bool,
  isBulkOperationEnabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  poll: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isBulkOperationEnabled: true,
  isSelected: false,
};

export default TableRow;
