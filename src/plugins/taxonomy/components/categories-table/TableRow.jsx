import PropTypes from 'prop-types';
import React from 'react';

import { Button, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Message from '@gdbots/pbj/Message';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({ disabled, isSelected, node: category }) => (
  <tr className={`status-${category.get('status')}`}>
    <td>
      {category.get('title')}
      <Collaborators nodeRef={category.get('_id').toNodeRef()} />
    </td>
    <td className="text-nowrap">{convertReadableTime(category.get('created_at')) }</td>
    <td className="text-nowrap">
      { category.has('updated_at') && convertReadableTime(category.get('updated_at')) }
    </td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(category, 'cms')}>
        <Button id={`view-${category.get('_id')}`} disabled={disabled} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${category.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(category, 'cms')}/edit`}>
        <Button id={`edit-${category.get('_id')}`} disabled={disabled} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${category.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
      <a
        href={pbjUrl(category, 'canonical')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button color="hover" id={`open-in-new-tab-${category.get('_id')}`} radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="external" style={{ color: isSelected ? 'white' : '' }} alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${category.get('_id')}`}>Open in new tab</UncontrolledTooltip>
      </a>
    </td>
  </tr>
);

TableRow.propTypes = {
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  node: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
