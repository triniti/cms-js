import PropTypes from 'prop-types';
import React from 'react';

import { Button, Checkbox, Icon, RouterLink, UncontrolledTooltip } from '@triniti/admin-ui-plugin/components';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import Message from '@gdbots/pbj/Message';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({
  gallery, disabled, onSelectRow, isSelected,
}) => (
  <tr className={`status-${gallery.get('status')}`}>
    <th scope="row">
      <Checkbox
        disabled={disabled}
        id={gallery.get('_id').toNodeRef().toString()}
        onChange={() => onSelectRow(gallery.get('_id').toNodeRef())}
        checked={isSelected}
        size="sm"
      />
    </th>
    <td>
      {gallery.get('title')}
      <Collaborators nodeRef={gallery.get('_id').toNodeRef()} />
    </td>
    <td className="text-nowrap">{convertReadableTime(gallery.get('order_date'))}</td>
    <td className="text-nowrap">
      {gallery.has('published_at') && convertReadableTime(gallery.get('published_at'))}
    </td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(gallery, 'cms')}>
        <Button color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
      </RouterLink>
      <RouterLink to={`${pbjUrl(gallery, 'cms')}/edit`}>
        <Button color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
      </RouterLink>
      <a
        href={pbjUrl(gallery, 'canonical')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button color="hover" id={`open-in-new-tab-${gallery.get('_id')}`} radius="circle" className="mr-1 mb-0">
          <Icon imgSrc="external" style={{ color: isSelected ? 'white' : '' }} alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${gallery.get('_id')}`}>Open in new tab</UncontrolledTooltip>
      </a>
    </td>
  </tr>
);

TableRow.propTypes = {
  gallery: PropTypes.instanceOf(Message).isRequired,
  disabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
