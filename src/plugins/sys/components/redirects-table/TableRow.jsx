import React from 'react';
import PropTypes from 'prop-types';

import Message from '@gdbots/pbj/Message';
import { Button, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({
  redirect, disabled, onSelectRow, isSelected,
}) => (
  <tr className={`status-${redirect.get('status')}`}>
    <th scope="row">
      <Checkbox
        disabled={disabled}
        id={redirect.get('_id').toNodeRef().toString()}
        onChange={() => onSelectRow(redirect.get('_id').toNodeRef())}
        checked={isSelected}
        size="sm"
      />
    </th>
    <td>
      {redirect.get('title')}
      <Collaborators nodeRef={redirect.get('_id').toNodeRef()} />
    </td>
    <td>
      {redirect.get('redirect_to')}
    </td>
    <td className="text-nowrap">{convertReadableTime(redirect.get('created_at'))}</td>
    <td className="text-nowrap">{redirect.has('updated_at') && convertReadableTime(redirect.get('updated_at'))}</td>
    <td className="td-icons" style={{ verticalAlign: 'middle' }}>
      <RouterLink to={pbjUrl(redirect, 'cms')}>
        <Button id={`view-${redirect.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${redirect.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(redirect, 'cms')}/edit`}>
        <Button id={`edit-${redirect.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${redirect.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
    </td>
  </tr>
);

TableRow.propTypes = {
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  redirect: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
