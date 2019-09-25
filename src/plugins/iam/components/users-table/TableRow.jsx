import React from 'react';
import PropTypes from 'prop-types';

import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({ user, rowIndex }) => (
  <tr className={`status-${user.get('status')}`}>
    <th scope="row">{ rowIndex }</th>
    <td>{ user.get('first_name') }</td>
    <td>{ user.get('last_name') }</td>
    <td>
      {user.get('email')}
      <Collaborators nodeRef={user.get('_id').toNodeRef()} />
    </td>
    <td>{ user.get('is_staff') ? 'Yes' : 'No' }</td>
    <td className="text-nowrap">{ convertReadableTime(user.get('created_at')) }</td>
    <td className="text-nowrap">{ convertReadableTime(user.get('updated_at')) }</td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(user, 'cms')}>
        <Button id={`view-${user.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${user.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(user, 'cms')}/edit`}>
        <Button id={`edit-${user.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${user.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
    </td>
  </tr>
);

TableRow.propTypes = {
  user: PropTypes.instanceOf(Message).isRequired,
  rowIndex: PropTypes.number,
};

TableRow.defaultProps = {
  rowIndex: 0,
};

export default TableRow;
