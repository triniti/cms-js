import React from 'react';
import PropTypes from 'prop-types';

import { Button, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({
  disabled, isSelected, onSelectRow, page,
}) => (
  <tr className={`status-${page.get('status')}`}>
    <th scope="row">
      <Checkbox
        disabled={disabled}
        id={page.get('_id').toNodeRef().toString()}
        onChange={() => onSelectRow(page.get('_id').toNodeRef())}
        checked={isSelected}
        size="sm"
      />
    </th>
    <td>
      {page.get('title')}
      <Collaborators nodeRef={page.get('_id').toNodeRef()} />
    </td>
    <td className="text-nowrap">{ convertReadableTime(page.get('order_date')) }</td>
    <td className="text-nowrap">
      {page.has('published_at') && convertReadableTime(page.get('published_at'))}
    </td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(page, 'cms')}>
        <Button id={`view-${page.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${page.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(page, 'cms')}/edit`}>
        <Button id={`edit-${page.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${page.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
      <a
        href={pbjUrl(page, 'canonical')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button color="hover" id={`open-in-new-tab-${page.get('_id')}`} radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="external" style={{ color: isSelected ? 'white' : '' }} alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${page.get('_id')}`}>Open in new tab</UncontrolledTooltip>
      </a>
    </td>
  </tr>
);

TableRow.propTypes = {
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  page: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
