import React from 'react';
import PropTypes from 'prop-types';

import { Button, Checkbox, Icon, RouterLink } from '@triniti/admin-ui-plugin/components';
import convertReadableTime from '@triniti/cms/utils/convertReadableTime';
import Collaborators from '@triniti/cms/plugins/raven/components/collaborators';
import NodeRef from '@gdbots/schemas/gdbots/ncr/NodeRef';
import Message from '@gdbots/pbj/Message';
import UncontrolledTooltip from '@triniti/cms/plugins/common/components/uncontrolled-tooltip';
import pbjUrl from '@gdbots/pbjx/pbjUrl';

const TableRow = ({
  sponsor, disabled, onSelectRow, isSelected,
}) => (
  <tr className={`status-${sponsor.get('status')}`}>
    <th scope="row">
      <Checkbox
        disabled={disabled}
        id={sponsor.get('_id').toString()}
        onChange={() => onSelectRow(NodeRef.fromNode(sponsor))}
        checked={isSelected}
        size="sm"
      />
    </th>
    <td>
      {sponsor.get('title')}
      <Collaborators nodeRef={NodeRef.fromNode(sponsor)} />
    </td>
    <td className="text-nowarp">{convertReadableTime(sponsor.get('created_at'))}</td>
    <td className="text-nowrap">
      {sponsor.has('published_at') && convertReadableTime(sponsor.get('published_at'))}
    </td>
    <td className="td-icons">
      <RouterLink to={pbjUrl(sponsor, 'cms')}>
        <Button id={`view-${sponsor.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="eye" alt="view" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`view-${sponsor.get('_id')}`}>View</UncontrolledTooltip>
      </RouterLink>
      <RouterLink to={`${pbjUrl(sponsor, 'cms')}/edit`}>
        <Button id={`edit-${sponsor.get('_id')}`} color="hover" radius="circle" className="mb-0 mr-1">
          <Icon imgSrc="pencil" alt="edit" />
        </Button>
        <UncontrolledTooltip placement="auto" target={`edit-${sponsor.get('_id')}`}>Edit</UncontrolledTooltip>
      </RouterLink>
    </td>
  </tr>
);

TableRow.propTypes = {
  sponsor: PropTypes.instanceOf(Message).isRequired,
  disabled: PropTypes.bool,
  onSelectRow: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

TableRow.defaultProps = {
  disabled: false,
  isSelected: false,
};

export default TableRow;
