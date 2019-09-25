import PropTypes from 'prop-types';
import React from 'react';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import damUrl from '@triniti/cms/plugins/dam/utils/damUrl';
import Message from '@gdbots/pbj/Message';
import pbjUrl from '@gdbots/pbjx/pbjUrl';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import { Button, CardImg, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';

const TableRow = ({
  disabled, isSelected, onSelectRow, person,
}) => (
  <tr className={`status-${person.get('status')}`}>
    <th scope="row">
      <Checkbox
        checked={isSelected}
        disabled={disabled}
        id={person.get('_id').toNodeRef().toString()}
        onChange={() => onSelectRow(person.get('_id').toNodeRef())}
        size="sm"
      />
    </th>
    <td>
      <CardImg
        alt={person.get('title')}
        className="img-responsive"
        src={person.has('image_ref') ? damUrl(person.get('image_ref'), '3by2', 'md') : ''}
        style={{ width: 110 }}
      />
    </td>
    <td>
      {person.get('title')}
      <Collaborators nodeRef={person.get('_id').toNodeRef()} />
    </td>
    <td>
      {person.get('slug')}
    </td>
    <td className="text-nowrap">{convertReadableTime(person.get('created_at'))}</td>
    <td className="text-nowrap">
      {person.has('updated_at') && convertReadableTime(person.get('updated_at'))}
    </td>
    <td className="td-icons" style={{ verticalAlign: 'middle' }}>
      <RouterLink to={pbjUrl(person, 'cms')}>
        <Button id={`view-${person.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${person.get('_id')}`}>
          View
        </UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(person, 'cms')}/edit`}>
        <Button id={`edit-${person.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${person.get('_id')}`}>
          Edit
        </UncontrolledTooltip>
      </RouterLink>
      <a
        href={pbjUrl(person, 'canonical')}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          className="mr-1 mb-0"
          color="hover"
          id={`open-in-new-tab-${person.get('_id')}`}
          radius="circle"
        >
          <Icon imgSrc="external" style={{ color: isSelected ? 'white' : '' }} alt="open" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`open-in-new-tab-${person.get('_id')}`}>
          Open in new tab
        </UncontrolledTooltip>
      </a>
    </td>
  </tr>
);

TableRow.propTypes = {
  disabled: PropTypes.bool,
  isSelected: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  person: PropTypes.instanceOf(Message).isRequired,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
